#!/usr/bin/env tsx
/**
 * OIV settlement guard (S1 interim fix) — ops tooling. Mechanism only: ops choose every
 * number. See `.claude/skills/oiv-settlement-guard/SKILL.md`.
 *
 *   yarn tsx scripts/settlementGuard.ts suggest <client> --down <pct> --up <pct> [--anchorPrice <p>] [--write]
 *   yarn tsx scripts/settlementGuard.ts check <client>
 *   yarn tsx scripts/settlementGuard.ts allowance-tx <client>
 *   yarn tsx scripts/settlementGuard.ts policy-tx <client>
 *
 * Every command takes `--instance` (default `manager_prod`). Reads the chain over RPC and
 * the Blockscout logs API (GET), compiles and encodes policies locally; it never POSTs to
 * a roles app or an indexer and never sends a transaction. Safe Transaction Builder files
 * (plus a `.raw.json` with the calldata) are written to ./export/.
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import yargs from "yargs"
import {
  Contract,
  Interface,
  JsonFragment,
  JsonFragmentType,
  ParamType,
  Result,
  formatUnits,
  getAddress,
  hexlify,
  isBytesLike,
} from "ethers"
import { encodeCalls, rolesAbi } from "zodiac-roles-sdk"
import { encodeBytes32String } from "defi-kit"
import { compileApplyData } from "../helpers/apply"
import { providers } from "../helpers/providers"
import {
  SETTLEMENT_GUARD_ALLOWANCE_KEY,
  SettlementGuard,
  validateSettlementGuard,
} from "../helpers/settlementGuard"

const ACCOUNT = "mainnet"
const CHAIN_ID = 1
const PRICE_DECIMALS = 8
const PROCESS_REQUESTS = "0xd6fd0c57"
const LOGS_API = "https://eth.blockscout.com/api"
const LOGS_PAGE = 1_000
const FETCH_TIMEOUT_MS = 20_000
const LOGS_ATTEMPTS = 5
const CLIENTS_DIR = path.join(__dirname, "..", "clients")
const EXPORT_DIR = path.join(__dirname, "..", "export")
const provider = providers[CHAIN_ID]

// Roles v2 operators read back from on-chain conditions
const OP_AND = 1
const OP_GREATER_THAN = 17
const OP_LESS_THAN = 18
const OP_CALL_WITHIN_ALLOWANCE = 30

const sharesIface = new Interface([
  "function getApprovedAssets() view returns (address[])",
  "function getLastSettledPrice(address asset) view returns (uint256)",
  "function processRequests(uint256[] approveRequests, uint256[] rejectRequests, address asset, uint256 sharesPriceInAsset)",
  "event SubscriptionApproval(uint256 requestId, uint256 assets, uint256 shares)",
  "event RedemptionApproval(uint256 requestId, uint256 assets, uint256 shares, uint256 redemptionFee)",
])
const safeIface = new Interface([
  "function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)",
])
const rolesIface = new Interface(rolesAbi as unknown as JsonFragment[])
const ALLOWANCES_ABI = [
  "function allowances(bytes32 key) view returns (uint128 refill, uint128 maxRefill, uint64 period, uint128 balance, uint64 timestamp)",
  "function owner() view returns (address)",
]

type EncodableCall = Parameters<typeof encodeCalls>[0][number]

// ---------------------------------------------------------------- discovery

const listGuardedClients = () =>
  fs
    .readdirSync(CLIENTS_DIR)
    .filter((client) => findGuardRoles(client).length === 1)

const findGuardRoles = (client: string) => {
  const rolesDir = path.join(CLIENTS_DIR, client, ACCOUNT, "roles")
  if (!fs.existsSync(rolesDir)) return []
  return fs.readdirSync(rolesDir).filter((role) => {
    const file = path.join(rolesDir, role, "permissions", "calls.ts")
    return (
      fs.existsSync(file) &&
      fs.readFileSync(file, "utf8").includes("export const settlementAssets")
    )
  })
}

const resolveRole = (client: string) => {
  const roles = findGuardRoles(client)
  const role = roles[0]
  if (roles.length !== 1 || role === undefined)
    throw new Error(
      `Unknown client "${client}": no single role with a settlement guard under clients/${client}/${ACCOUNT}/roles on this branch.\nClients with a settlement guard here: ${listGuardedClients().join(", ") || "(none)"}`
    )
  return role
}

const loadInstance = async (client: string, instance: string) => {
  const dir = path.join(CLIENTS_DIR, client, ACCOUNT, "instances")
  const file = path.join(dir, `${instance}.ts`)
  if (!fs.existsSync(file)) {
    const available = fs.existsSync(dir)
      ? fs.readdirSync(dir).map((f) => f.replace(/\.ts$/, ""))
      : []
    throw new Error(
      `Unknown instance "${instance}" for ${client}. Available: ${available.join(", ") || "(none)"}`
    )
  }
  const mod = await import(pathToFileURL(file).href)
  const parameters = mod.parameters as {
    avatar: string
    shares: string
    settlementGuard?: unknown
  }
  return {
    file,
    rolesMod: getAddress(mod.rolesMod as string),
    roleKeyPrefix: (mod.roleKeyPrefix as string | undefined) ?? "",
    avatar: getAddress(parameters.avatar),
    shares: getAddress(parameters.shares),
    guard: parameters.settlementGuard,
  }
}

const loadPin = async (client: string, role: string) => {
  const file = path.join(
    CLIENTS_DIR,
    client,
    ACCOUNT,
    "roles",
    role,
    "permissions",
    "calls.ts"
  )
  const mod = await import(pathToFileURL(file).href)
  return (mod.settlementAssets as readonly string[]).map((a) => getAddress(a))
}

/** Returns the validated guard, or the reason it is not usable (e.g. still TODO_OPS). */
const tryGuard = (
  guard: unknown,
  where: string
): { ok: true; guard: SettlementGuard } | { ok: false; reason: string } => {
  try {
    return { ok: true, guard: validateSettlementGuard(guard, where) }
  } catch (e) {
    return { ok: false, reason: (e as Error).message }
  }
}

// ---------------------------------------------------------------- helpers

const read = async <T>(c: Contract, fn: string, ...args: unknown[]) =>
  (await c.getFunction(fn).staticCall(...args)) as T

const sharesContract = (shares: string) =>
  new Contract(shares, sharesIface, provider)

const rel = (p: string) =>
  path.relative(process.cwd(), p).split(path.sep).join("/")

const fmt = (x: bigint) => formatUnits(x, PRICE_DECIMALS)
const pct = (num: bigint, den: bigint) => (Number(num) / Number(den)) * 100

const isoOrSeconds = (seconds: bigint) =>
  seconds < 8_640_000_000_000n
    ? new Date(Number(seconds) * 1000).toISOString()
    : `${seconds}s after the epoch`

/** A price is "near an edge" when closer to it than `fraction` of the band width. */
const nearEdge = (
  price: bigint,
  min: bigint,
  max: bigint,
  fraction: number
) => {
  const margin = (Number(max - min) * fraction) | 0
  return price - min < BigInt(margin) || max - price < BigInt(margin)
}

/** Worst case for a leaked bot key, as a fraction of the attacker's capital. */
const worstCase = (min: bigint, max: bigint, calls: number) =>
  Math.pow(Number(max) / Number(min), Math.floor(calls / 2)) - 1

/**
 * Most calls a key can make within seconds: spend the whole bucket right before a
 * refill boundary and the refill right after it.
 */
const burstCalls = (a: SettlementGuard["callAllowance"]) =>
  Math.max(a.balance, a.maxRefill) + Math.min(a.refill, a.maxRefill)

const approvedVsPin = async (shares: string, pin: readonly string[]) => {
  const approved = (
    await read<string[]>(sharesContract(shares), "getApprovedAssets")
  ).map((a) => getAddress(a))
  const notPinned = approved.filter((a) => !pin.includes(a))
  const notApproved = pin.filter((a) => !approved.includes(a))
  console.log(`approved assets on shares: ${approved.join(", ")}`)
  console.log(`asset pin in calls.ts:     ${pin.join(", ")}`)
  if (notPinned.length)
    console.log(
      `  ⚠️  approved but NOT pinned: ${notPinned.join(", ")} — the bot cannot settle it (ConditionViolation 7, or 5 with several pinned assets); settle it via the Manager Safe, then extend settlementAssets`
    )
  if (notApproved.length)
    console.log(
      `  ⚠️  pinned but NOT approved on the shares: ${notApproved.join(", ")} — ignored for anchoring`
    )
  if (!notPinned.length && !notApproved.length)
    console.log("  ✅ pin matches the approved assets")
  return approved
}

const lastSettledPrices = async (shares: string, assets: readonly string[]) => {
  const c = sharesContract(shares)
  return Promise.all(
    assets.map(async (asset) => ({
      asset,
      price: await read<bigint>(c, "getLastSettledPrice", asset),
    }))
  )
}

type Allowance = {
  refill: bigint
  maxRefill: bigint
  period: bigint
  balance: bigint
  timestamp: bigint
}

const readAllowance = async (rolesMod: string): Promise<Allowance> => {
  const r = await read<Result>(
    new Contract(rolesMod, ALLOWANCES_ABI, provider),
    "allowances",
    SETTLEMENT_GUARD_ALLOWANCE_KEY
  )
  return {
    refill: r[0] as bigint,
    maxRefill: r[1] as bigint,
    period: r[2] as bigint,
    balance: r[3] as bigint,
    timestamp: r[4] as bigint,
  }
}

const isUnset = (a: Allowance) =>
  a.refill === 0n && a.maxRefill === 0n && a.period === 0n && a.balance === 0n

/** Mirrors the Roles modifier's accrual: balance + refill per elapsed period, capped. */
const accrue = (
  a: Allowance,
  now: bigint
): { balance: bigint; nextRefill?: bigint } => {
  if (a.period === 0n) return { balance: a.balance } // never refills
  if (now < a.timestamp + a.period)
    return { balance: a.balance, nextRefill: a.timestamp + a.period }
  const elapsed = (now - a.timestamp) / a.period
  const cap = a.maxRefill // setAllowance stores maxRefill 0 as uint128.max
  const balance =
    a.balance < cap
      ? a.balance + a.refill * elapsed > cap
        ? cap
        : a.balance + a.refill * elapsed
      : a.balance
  return { balance, nextRefill: a.timestamp + (elapsed + 1n) * a.period }
}

const assertOwner = async (rolesMod: string, avatar: string) => {
  const owner = getAddress(
    await read<string>(
      new Contract(rolesMod, ALLOWANCES_ABI, provider),
      "owner"
    )
  )
  if (owner !== avatar)
    throw new Error(
      `Roles mod ${rolesMod} is owned by ${owner}, not by the instance avatar ${avatar}. The batch would not be executable by that Safe.`
    )
  return owner
}

// ---------------------------------------------------------------- logs (Blockscout)

type ApiLog = {
  transactionHash: string
  blockNumber: string
  logIndex: string
  topics: (string | null)[]
  data: string
}

const fetchLogPage = async (
  address: string,
  topic: string,
  from: number
): Promise<ApiLog[]> => {
  let reason = ""
  let wait = 0
  for (let attempt = 0; attempt < LOGS_ATTEMPTS; attempt++) {
    if (wait) await new Promise((r) => setTimeout(r, wait))
    // Free tier rate-limits bursts (HTTP 429): back off 2s, 4s, 8s… or as told
    wait = 2_000 * 2 ** attempt
    try {
      const res = await fetch(
        `${LOGS_API}?module=logs&action=getLogs&address=${address}&fromBlock=${from}&toBlock=latest&topic0=${topic}`,
        { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) }
      )
      const retryAfter = Number(res.headers.get("retry-after"))
      if (retryAfter > 0) wait = Math.min(retryAfter * 1_000, 30_000)
      const body = (await res.json().catch(() => ({}))) as {
        result?: ApiLog[] | null
        message?: string
      }
      if (Array.isArray(body.result)) return body.result
      reason = `HTTP ${res.status}${body.message ? ` ${body.message}` : ""}`
    } catch (e) {
      reason = (e as Error).message
    }
  }
  throw new Error(
    `logs API ${LOGS_API} failed ${LOGS_ATTEMPTS} times (${reason})`
  )
}

/** All logs for one topic, paging past the API's per-call cap with a block cursor. */
const fetchLogs = async (address: string, topic: string, fromBlock = 0) => {
  const out = new Map<string, ApiLog>()
  let from = fromBlock
  for (;;) {
    const logs = await fetchLogPage(address, topic, from)
    for (const l of logs) out.set(`${l.transactionHash}:${l.logIndex}`, l)
    if (logs.length < LOGS_PAGE) break
    const last = Math.max(...logs.map((l) => Number(BigInt(l.blockNumber))))
    if (last <= from) break
    from = last
  }
  return [...out.values()]
}

const logOrder = (l: ApiLog) =>
  BigInt(l.blockNumber) * 1_000_000n +
  BigInt(l.logIndex === "0x" ? 0 : l.logIndex)

// ---------------------------------------------------------------- live policy

type LivePolicy =
  | { state: "none" }
  | { state: "wildcarded"; how: string }
  | {
      state: "scoped"
      budget: boolean
      min?: bigint
      max?: bigint
    }

/** Replays the role's target/function events on the modifier for processRequests. */
const readLivePolicy = async (
  rolesMod: string,
  roleKey: string,
  shares: string
): Promise<LivePolicy> => {
  const names = [
    "ScopeTarget",
    "AllowTarget",
    "RevokeTarget",
    "ScopeFunction",
    "AllowFunction",
    "RevokeFunction",
  ]
  const logs: ApiLog[] = []
  for (const name of names) {
    const topic = rolesIface.getEvent(name)?.topicHash
    if (topic) logs.push(...(await fetchLogs(rolesMod, topic)))
  }
  logs.sort((a, b) => (logOrder(a) < logOrder(b) ? -1 : 1))
  let target: "none" | "scoped" | "allowed" = "none"
  let fn: LivePolicy = { state: "none" }
  for (const l of logs) {
    const ev = rolesIface.parseLog({
      topics: l.topics.filter((t): t is string => !!t),
      data: l.data,
    })
    if (!ev || ev.args[0] !== roleKey) continue
    if (getAddress(ev.args[1] as string) !== shares) continue
    switch (ev.name) {
      case "ScopeTarget":
        target = "scoped"
        break
      case "AllowTarget":
        target = "allowed"
        break
      case "RevokeTarget":
        target = "none"
        break
      default: {
        if (ev.args[2] !== PROCESS_REQUESTS) break
        if (ev.name === "RevokeFunction") fn = { state: "none" }
        else if (ev.name === "AllowFunction")
          fn = { state: "wildcarded", how: "allowFunction (no conditions)" }
        else {
          const conds = ev.args[3] as unknown as [
            bigint,
            bigint,
            bigint,
            string,
          ][]
          const op = (c: [bigint, bigint, bigint, string]) => Number(c[2])
          const ands = new Set(
            conds
              .map((c, i) => (op(c) === OP_AND ? i : -1))
              .filter((i) => i >= 0)
          )
          const gt = conds.find(
            (c) => op(c) === OP_GREATER_THAN && ands.has(Number(c[0]))
          )
          const lt = conds.find(
            (c) => op(c) === OP_LESS_THAN && ands.has(Number(c[0]))
          )
          fn = {
            state: "scoped",
            budget: conds.some(
              (c, i) =>
                op(c) === OP_CALL_WITHIN_ALLOWANCE &&
                Number(c[0]) === 0 &&
                i !== 0 &&
                c[3].toLowerCase() ===
                  SETTLEMENT_GUARD_ALLOWANCE_KEY.toLowerCase()
            ),
            min: gt ? BigInt(gt[3]) + 1n : undefined,
            max: lt ? BigInt(lt[3]) - 1n : undefined,
          }
        }
      }
    }
  }
  if (target === "allowed")
    return { state: "wildcarded", how: "allowTarget (whole contract)" }
  if (target === "none") return { state: "none" }
  return fn
}

// ---------------------------------------------------------------- history

type Settlement = {
  block: number
  tx: string
  asset?: string
  price?: bigint
  approve?: number
  reject?: number
  via: string
}

const decodeProcessRequests = (shares: string, to: string, data: string) => {
  if (getAddress(to) !== shares) return undefined
  try {
    const d = sharesIface.decodeFunctionData("processRequests", data)
    return {
      approve: (d[0] as unknown[]).length,
      reject: (d[1] as unknown[]).length,
      asset: getAddress(d[2] as string),
      price: d[3] as bigint,
    }
  } catch {
    return undefined
  }
}

const settlementHistory = async (
  shares: string,
  lookbackBlocks: number,
  count: number
) => {
  // 0 = from genesis. The repo's public RPC refuses historical eth_getLogs, so logs
  // come from the Blockscout API (no key needed).
  const fromBlock =
    lookbackBlocks > 0
      ? Math.max(0, (await provider.getBlockNumber()) - lookbackBlocks)
      : 0
  const txBlocks = new Map<string, number>()
  for (const name of ["SubscriptionApproval", "RedemptionApproval"]) {
    const topic = sharesIface.getEvent(name)?.topicHash
    if (!topic) continue
    for (const l of await fetchLogs(shares, topic, fromBlock))
      txBlocks.set(l.transactionHash, Number(BigInt(l.blockNumber)))
  }
  const viaRole = [
    rolesIface.getFunction("execTransactionWithRole"),
    rolesIface.getFunction("execTransactionWithRoleReturnData"),
  ]
  const viaSafe = safeIface.getFunction("execTransaction")
  const txs = [...txBlocks.entries()].sort((a, b) => b[1] - a[1])
  const out: Settlement[] = []
  for (const [hash, block] of txs.slice(0, count)) {
    const tx = await provider.getTransaction(hash)
    let found: Settlement = { block, tx: hash, via: "unrecognised" }
    if (tx?.to) {
      const sel = tx.data.slice(0, 10)
      const role = viaRole.find((f) => f?.selector === sel)
      if (role) {
        const d = rolesIface.decodeFunctionData(role, tx.data)
        const p = decodeProcessRequests(shares, d[0] as string, d[2] as string)
        if (p) found = { block, tx: hash, via: "bot (role)", ...p }
      } else if (viaSafe && sel === viaSafe.selector) {
        const d = safeIface.decodeFunctionData(viaSafe, tx.data)
        const p = decodeProcessRequests(shares, d[0] as string, d[2] as string)
        found = p
          ? { block, tx: hash, via: "Safe direct", ...p }
          : { block, tx: hash, via: "Safe batch (n/a)" }
      }
    }
    out.push(found)
  }
  return { settlements: out, totalTxs: txs.length }
}

// ---------------------------------------------------------------- commands

const suggest = async (args: {
  client: string
  instance: string
  down: number
  up: number
  anchorPrice?: string
  write: boolean
  history: number
  lookbackBlocks: number
  nearEdge: number
}) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const pin = await loadPin(args.client, role)
  const toBps = (p: number, name: string, max: number) => {
    const b = Math.round(p * 100)
    if (!Number.isFinite(p) || b <= 0 || b >= max)
      throw new Error(
        `--${name} must be a percentage > 0 and < ${max / 100} (two decimals)`
      )
    return BigInt(b)
  }
  const downBps = toBps(args.down, "down", 10_000)
  const upBps = toBps(args.up, "up", 1_000_000)

  console.log(`${args.client} ${args.instance} (${role}) shares ${inst.shares}`)
  const approved = await approvedVsPin(inst.shares, pin)
  const anchorAssets = pin.filter((a) => approved.includes(a))
  if (!anchorAssets.length)
    throw new Error("no pinned asset is approved on the shares")

  const prices = await lastSettledPrices(inst.shares, anchorAssets)
  for (const p of prices)
    console.log(`last settled price ${p.asset}: ${fmt(p.price)} (${p.price})`)
  console.log(
    "  note: the bot can move getLastSettledPrice anywhere inside the live band (even with empty arrays), and it freezes when the real price leaves the band — compare with the fund's NAV and pass --anchorPrice when they differ"
  )

  let low: bigint
  let high: bigint
  if (args.anchorPrice !== undefined) {
    if (!/^[1-9][0-9]*$/.test(args.anchorPrice))
      throw new Error("--anchorPrice must be a positive integer (8 decimals)")
    low = high = BigInt(args.anchorPrice)
    console.log(`anchor: --anchorPrice ${fmt(low)} (ops-supplied)`)
  } else {
    const unsettled = prices.filter((p) => p.price === 0n)
    if (unsettled.length)
      throw new Error(
        `${unsettled.map((p) => p.asset).join(", ")} never settled on-chain (last settled price 0) — settle it via the Manager Safe first, or pass --anchorPrice`
      )
    const all = prices.map((p) => p.price)
    low = all.reduce((a, b) => (a < b ? a : b))
    high = all.reduce((a, b) => (a > b ? a : b))
  }

  if (args.history > 0) {
    // History is informational: a failing logs source must not block the suggestion.
    try {
      const { settlements, totalTxs } = await settlementHistory(
        inst.shares,
        args.lookbackBlocks,
        args.history
      )
      console.log(
        `\nlast ${settlements.length} settlements (of ${totalTxs} txs that approved requests ${args.lookbackBlocks > 0 ? `in the last ${args.lookbackBlocks} blocks` : "since genesis"}):`
      )
      if (totalTxs === 0)
        console.log(
          "  none found — widen --lookbackBlocks (0 = from genesis) before choosing the band"
        )
      for (const s of settlements)
        console.log(
          `  block ${s.block}  ${s.price !== undefined ? fmt(s.price) : "n/a"}  ${s.asset ?? ""}  approve ${s.approve ?? "?"} / reject ${s.reject ?? "?"}  via ${s.via}  ${s.tx}`
        )
      console.log(
        "  note: only calls that approved a request appear here; reject-only and empty calls also spend the call budget"
      )
    } catch (e) {
      console.log(
        `\n⚠️  settlement history unavailable (${(e as Error).message.split("\n")[0]}) — check it on a block explorer before choosing the band`
      )
    }
  }

  const min = (low * (10_000n - downBps)) / 10_000n
  const max = (high * (10_000n + upBps) + 9_999n) / 10_000n
  console.log(
    `\nproposed band (-${args.down}% from the ${args.anchorPrice ? "anchor" : "lowest last settled price"}, +${args.up}% from the ${args.anchorPrice ? "anchor" : "highest"}):`
  )
  console.log(`  sharesPriceMin: "${min}"  (${fmt(min)})`)
  console.log(`  sharesPriceMax: "${max}"  (${fmt(max)})`)

  const current = tryGuard(inst.guard, `${args.client} ${args.instance}`)
  if (current.ok) {
    const cMin = BigInt(current.guard.sharesPriceMin)
    const cMax = BigInt(current.guard.sharesPriceMax)
    console.log(`current band (instance file): [${fmt(cMin)}, ${fmt(cMax)}]`)
    if (low < cMin || high > cMax)
      console.log("  ❌ the anchor is OUTSIDE the current band")
    else if (
      nearEdge(low, cMin, cMax, args.nearEdge) ||
      nearEdge(high, cMin, cMax, args.nearEdge)
    )
      console.log(
        "  ⚠️  the anchor sits near a current edge — re-centring on it ratchets the band in the direction of the drift; check the history and the NAV first"
      )
  } else console.log(`current band: not configured (${current.reason})`)

  console.log(
    `\nworst case for a leaked bot key, as a share of the attacker's capital:`
  )
  console.log(
    `  per subscribe+redeem cycle (2 calls): ${(worstCase(min, max, 2) * 100).toFixed(2)}%`
  )
  if (current.ok) {
    const a = current.guard.callAllowance
    const burst = burstCalls(a)
    console.log(
      `  burst — ${burst} calls within seconds (bucket spent just before a refill + the refill): ${(worstCase(min, max, burst) * 100).toFixed(2)}%  = (max/min)^floor(N/2) - 1`
    )
    console.log(
      `  sustained — ${a.refill} calls every ${a.periodSeconds}s after that: ${(worstCase(min, max, a.refill) * 100).toFixed(2)}% per period`
    )
  } else
    console.log(
      "  burst / sustained: set callAllowance in the instance to see them"
    )
  console.log(
    "  real cap: the cash an attacker can actually redeem — keep idle cash on the Portfolio Safe minimal"
  )

  if (args.write) {
    let src = fs.readFileSync(inst.file, "utf8")
    const block = src.indexOf("settlementGuard:")
    if (block < 0) throw new Error(`no settlementGuard block in ${inst.file}`)
    const set = (field: string, value: bigint) => {
      const re = new RegExp(`^(\\s*${field}:\\s*)(TODO_OPS|"[0-9]+")`, "m")
      const tail = src.slice(block)
      if (!re.test(tail))
        throw new Error(
          `${field} not found in the settlementGuard block of ${inst.file}`
        )
      src = src.slice(0, block) + tail.replace(re, `$1"${value}"`)
    }
    set("sharesPriceMin", min)
    set("sharesPriceMax", max)
    if ((src.match(/TODO_OPS/g) ?? []).length === 1)
      src = src.replace(/import \{ TODO_OPS \} from "@\/helpers"\r?\n/, "")
    fs.writeFileSync(inst.file, src)
    console.log(`\nwrote sharesPriceMin/Max to ${rel(inst.file)}`)
  }
  console.log(
    `\nnext: yarn tsx scripts/settlementGuard.ts policy-tx ${args.client} --instance ${args.instance}`
  )
}

const check = async (args: {
  client: string
  instance: string
  nearEdge: number
}) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const rolesMod = inst.rolesMod
  const roleKey = encodeBytes32String(inst.roleKeyPrefix + role)
  const pin = await loadPin(args.client, role)
  console.log(
    `${args.client} ${args.instance} (${role}) — roles mod ${rolesMod}`
  )
  await approvedVsPin(inst.shares, pin)

  if (inst.guard === undefined) {
    console.log(
      `\n${args.client} ${args.instance} has no settlementGuard, so it is not guarded here (only the settlement role's manager instances carry it${args.client === "eth-alpha-fund" && args.instance === "manager_stage" ? "; eth-alpha manager_stage is excluded by decision" : ""}).`
    )
    return
  }
  const g = tryGuard(inst.guard, `${args.client} ${args.instance}`)
  if (!g.ok) console.log(`\ninstance band: not configured (${g.reason})`)

  // 1. what is live on-chain
  let live: LivePolicy | undefined
  try {
    live = await readLivePolicy(rolesMod, roleKey, inst.shares)
  } catch (e) {
    console.log(`\n⚠️  live policy unavailable (${(e as Error).message})`)
  }
  if (live) {
    if (live.state === "none")
      console.log(
        `\nlive policy: ${role} cannot call processRequests on ${inst.shares}`
      )
    else if (live.state === "wildcarded")
      console.log(
        `\n❌ live policy: processRequests is ${live.how} — NO band, NO budget (the guard has been removed)`
      )
    else {
      const band =
        live.min !== undefined && live.max !== undefined
          ? `band [${fmt(live.min)}, ${fmt(live.max)}]`
          : "NO band"
      console.log(
        `\nlive policy: scoped — ${band}, ${live.budget ? "budget node present" : "NO budget node"}${live.min === undefined || !live.budget ? "  ❌ not guarded" : "  ✅ guarded"}`
      )
      if (g.ok && live.min !== undefined && live.max !== undefined) {
        const same =
          live.min === BigInt(g.guard.sharesPriceMin) &&
          live.max === BigInt(g.guard.sharesPriceMax)
        console.log(
          same
            ? "  ✅ live band matches the instance file"
            : "  ⚠️  live band differs from the instance file (pending policy-tx, or drift)"
        )
      }
    }
  }
  const liveBand =
    live?.state === "scoped" && live.min !== undefined && live.max !== undefined
      ? { min: live.min, max: live.max }
      : g.ok
        ? {
            min: BigInt(g.guard.sharesPriceMin),
            max: BigInt(g.guard.sharesPriceMax),
          }
        : undefined

  // 2. last settled prices vs the band
  const prices = await lastSettledPrices(inst.shares, pin)
  console.log(
    `\nlast settled prices${liveBand ? ` vs ${live?.state === "scoped" && live.min !== undefined ? "the live" : "the instance"} band [${fmt(liveBand.min)}, ${fmt(liveBand.max)}]` : ""}:`
  )
  for (const p of prices) {
    if (!liveBand) {
      console.log(`  ${p.asset} ${fmt(p.price)}`)
      continue
    }
    const { min, max } = liveBand
    const flag =
      p.price === 0n
        ? "never settled"
        : p.price < min || p.price > max
          ? "❌ OUTSIDE"
          : nearEdge(p.price, min, max, args.nearEdge)
            ? "⚠️ near an edge — plan a re-centre"
            : "✅"
    console.log(
      `  ${p.asset} ${fmt(p.price)}  ${pct(p.price - min, p.price).toFixed(2)}% above floor, ${pct(max - p.price, p.price).toFixed(2)}% below ceiling  ${flag}`
    )
  }
  console.log(
    "  note: inside a live band the last settled price can only be in-band; if the bot reverts with ConditionViolation 8/9 the real price is outside — use the bot's attempted price / the NAV, not these numbers"
  )

  // 3. the call budget
  const a = await readAllowance(rolesMod)
  const block = await provider.getBlock("latest")
  const now = BigInt(block?.timestamp ?? Math.floor(Date.now() / 1000))
  const guarded = live?.state === "scoped" && live.budget
  console.log(
    `\nallowance "processRequests-calls" on ${rolesMod}: refill ${a.refill}, maxRefill ${a.maxRefill}, period ${a.period}s, stored balance ${a.balance}, timestamp ${a.timestamp}`
  )
  if (isUnset(a)) {
    console.log(
      guarded
        ? "  ❌ UNSET while the live policy requires it — every bot call reverts (CallAllowanceExceeded). Run allowance-tx."
        : "  UNSET — expected until the guard batch (policy + allowance) is executed."
    )
  } else {
    const { balance, nextRefill } = accrue(a, now)
    if (balance === 0n)
      console.log(
        `  ${guarded ? "❌" : "⚠️"} EXHAUSTED — balance 0; next refill ${nextRefill === undefined ? "never (period 0)" : `at ${isoOrSeconds(nextRefill)}`}`
      )
    else console.log(`  available now: ${balance} call(s)`)
    if (!guarded)
      console.log("  ⚠️  allowance is set but the live policy does not use it")
  }
  if (g.ok && !isUnset(a)) {
    const w = g.guard.callAllowance
    const same =
      a.refill === BigInt(w.refill) &&
      a.maxRefill === BigInt(w.maxRefill) &&
      a.period === BigInt(w.periodSeconds)
    console.log(
      same
        ? "  ✅ refill / maxRefill / period match the instance config"
        : "  ❌ differs from the instance config — run allowance-tx"
    )
  }
}

// Safe Transaction Builder JSON in the scripts/applyExport.ts shape (no `data`, so
// signers see decoded arguments), plus a raw sidecar with the calldata for fork tests.
const mapInputs = (
  inputs: readonly JsonFragmentType[] | undefined
): unknown[] | undefined =>
  inputs?.map((i) => ({
    internalType: i.internalType || "",
    name: i.name || "",
    type: i.type || "",
    components: mapInputs(i.components),
  }))

const serialize = (result: Result, params: readonly ParamType[]) => {
  const out: Record<string, string> = {}
  params.forEach((p, idx) => {
    const v: unknown = result[idx]
    out[p.name] =
      typeof v === "string"
        ? v
        : typeof v === "bigint" || typeof v === "number"
          ? v.toString()
          : isBytesLike(v)
            ? hexlify(v)
            : JSON.stringify(v, (_, x) =>
                isBytesLike(x)
                  ? hexlify(x)
                  : typeof x === "bigint"
                    ? x.toString()
                    : x
              )
  })
  return out
}

const toTxBuilder = (
  name: string,
  description: string,
  safe: string,
  calls: { to: string; data: string }[]
) => ({
  version: "1.0",
  chainId: String(CHAIN_ID),
  createdAt: Date.now(),
  meta: {
    name,
    description,
    txBuilderVersion: "1.16.2",
    createdFromSafeAddress: safe,
  },
  transactions: calls.map((call) => {
    const parsed = rolesIface.parseTransaction({ data: call.data })
    if (!parsed) throw new Error(`cannot decode call to ${call.to}`)
    const abiEntry = (rolesAbi as unknown as JsonFragment[]).find(
      (f) => f.type === "function" && f.name === parsed.name
    )
    return {
      to: call.to,
      value: "0",
      contractMethod: {
        inputs: mapInputs(abiEntry?.inputs) ?? [],
        name: parsed.name,
        payable: false,
      },
      contractInputsValues: serialize(parsed.args, parsed.fragment.inputs),
    }
  }),
})

const writeExport = (
  base: string,
  safe: string,
  name: string,
  description: string,
  calls: { to: string; data: string }[]
) => {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
  const builder = path.join(EXPORT_DIR, `${base}.json`)
  const raw = path.join(EXPORT_DIR, `${base}.raw.json`)
  fs.writeFileSync(
    builder,
    JSON.stringify(toTxBuilder(name, description, safe, calls), null, 2)
  )
  fs.writeFileSync(
    raw,
    JSON.stringify({ chainId: CHAIN_ID, safe, transactions: calls }, null, 2)
  )
  return { builder, raw }
}

const allowanceTx = async (args: { client: string; instance: string }) => {
  resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const rolesMod = inst.rolesMod
  const g = validateSettlementGuard(
    inst.guard,
    `${args.client} ${args.instance}`
  )
  await assertOwner(rolesMod, inst.avatar)
  const w = g.callAllowance
  const current = await readAllowance(rolesMod)
  console.log(
    `setAllowance("processRequests-calls") on ${rolesMod}, signed by ${inst.avatar}`
  )
  console.log(
    `  current: ${isUnset(current) ? "UNSET" : `balance ${current.balance}, maxRefill ${current.maxRefill}, refill ${current.refill}, period ${current.period}s`}`
  )
  console.log(
    `  new:     balance ${w.balance}, maxRefill ${w.maxRefill}, refill ${w.refill}, period ${w.periodSeconds}s, timestamp 0 (periods start at execution)`
  )
  console.log(
    "  ⚠️  setAllowance overwrites the balance: it becomes the new `balance` immediately (an instant refill)."
  )
  if (w.balance === 0)
    console.log(
      "  ⚠️  balance 0: the bot is blocked until the first refill, one full period after execution."
    )
  if (w.balance > w.maxRefill)
    console.log(
      "  ⚠️  balance > maxRefill: a one-off larger budget; refills only resume once the balance drops below maxRefill."
    )
  const data = rolesIface.encodeFunctionData("setAllowance", [
    SETTLEMENT_GUARD_ALLOWANCE_KEY,
    w.balance,
    w.maxRefill,
    w.refill,
    w.periodSeconds,
    0,
  ])
  const out = writeExport(
    `${args.client}_${args.instance}_${rolesMod.slice(0, 10)}_setAllowance`,
    inst.avatar,
    `${args.client} ${args.instance}: settlement guard call allowance`,
    `setAllowance(processRequests-calls) on ${rolesMod}`,
    [{ to: rolesMod, data }]
  )
  console.log(
    `wrote ${rel(out.builder)} (Safe Tx Builder) + ${rel(out.raw)} (calldata) — Safe ${inst.avatar}`
  )
}

const policyTx = async (args: { client: string; instance: string }) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const rolesMod = inst.rolesMod
  await assertOwner(rolesMod, inst.avatar)
  // Compile the role exactly as `yarn apply` would, then encode it locally: one
  // scopeTarget + one scopeFunction per function. No planning against the live role
  // (no indexer, no roles app), so nothing else of the role is revoked.
  const { targets, roleKey } = await compileApplyData({
    clientArg: args.client,
    accountArg: `${ACCOUNT}/${args.instance}`,
    roleArg: role,
  })
  const key = encodeBytes32String(roleKey) as `0x${string}`
  const planned: EncodableCall[] = []
  for (const t of targets) {
    if (!t.functions.length)
      throw new Error(`${t.address}: expected a function-scoped target`)
    planned.push({
      call: "scopeTarget",
      roleKey: key,
      targetAddress: t.address,
    })
    for (const f of t.functions) {
      if (f.wildcarded || !f.condition)
        throw new Error(
          `${t.address} ${f.selector}: the settlement role must be scoped, not wildcarded`
        )
      planned.push({
        call: "scopeFunction",
        roleKey: key,
        targetAddress: t.address,
        selector: f.selector,
        condition: f.condition,
        executionOptions: f.executionOptions,
      })
    }
  }
  const calls = encodeCalls(planned, rolesMod as `0x${string}`)
  for (const call of calls) {
    const p = rolesIface.parseTransaction({ data: call.data })
    console.log(
      `  ${p?.name}(${p?.name === "scopeFunction" ? `${p.args[1]}, ${p.args[2]}, ${(p.args[3] as unknown[]).length} conditions` : String(p?.args[1] ?? "")})`
    )
  }
  const out = writeExport(
    `${args.client}_${args.instance}_${rolesMod.slice(0, 10)}_${role}_policy`,
    inst.avatar,
    `${args.client} ${args.instance}: ${role} policy with settlement guard`,
    `${role} on ${rolesMod}`,
    calls.map((c) => ({ to: rolesMod, data: c.data }))
  )
  console.log(
    `wrote ${rel(out.builder)} (Safe Tx Builder) + ${rel(out.raw)} (calldata) — Safe ${inst.avatar}`
  )
}

// ---------------------------------------------------------------- cli

const withCommon = <T>(y: yargs.Argv<T>) =>
  y
    .positional("client", { type: "string", demandOption: true })
    .option("instance", {
      type: "string",
      default: "manager_prod",
      describe: "instance file under clients/<client>/mainnet/instances",
    })

const nearEdgeOption = {
  type: "number" as const,
  default: 0.1,
  describe:
    "warn when a price is closer to an edge than this fraction of the band width",
}

const run = (fn: () => Promise<void>) =>
  fn().catch((e: Error) => {
    console.error(`\n❌ ${e.message}`)
    process.exit(1)
  })

yargs(process.argv.slice(2))
  .scriptName("yarn tsx scripts/settlementGuard.ts")
  .command(
    "suggest <client>",
    "propose a band from the last settled prices (or an ops-supplied anchor)",
    (y) =>
      withCommon(y)
        .option("down", {
          type: "number",
          demandOption: true,
          describe: "% below the anchor (lowest last settled price)",
        })
        .option("up", {
          type: "number",
          demandOption: true,
          describe: "% above the anchor (highest last settled price)",
        })
        .option("anchorPrice", {
          type: "string",
          describe:
            "ops-supplied anchor (integer, 8 decimals) instead of the last settled prices",
        })
        .option("write", {
          type: "boolean",
          default: false,
          describe: "write sharesPriceMin/Max into the instance file",
        })
        .option("history", {
          type: "number",
          default: 10,
          describe: "settlements to list",
        })
        .option("lookbackBlocks", {
          type: "number",
          default: 0,
          describe: "blocks to scan for settlements (0 = from genesis)",
        })
        .option("nearEdge", nearEdgeOption),
    (a) =>
      run(() =>
        suggest({
          client: a.client as string,
          instance: a.instance,
          down: a.down,
          up: a.up,
          anchorPrice: a.anchorPrice,
          write: a.write,
          history: a.history,
          lookbackBlocks: a.lookbackBlocks,
          nearEdge: a.nearEdge,
        })
      )
  )
  .command(
    "check <client>",
    "live policy, band position and call budget vs the instance config",
    (y) => withCommon(y).option("nearEdge", nearEdgeOption),
    (a) =>
      run(() =>
        check({
          client: a.client as string,
          instance: a.instance,
          nearEdge: a.nearEdge,
        })
      )
  )
  .command(
    "allowance-tx <client>",
    "setAllowance for the call budget (./export/)",
    (y) => withCommon(y),
    (a) =>
      run(() =>
        allowanceTx({
          client: a.client as string,
          instance: a.instance,
        })
      )
  )
  .command(
    "policy-tx <client>",
    "the guarded policy, compiled and encoded locally (./export/)",
    (y) => withCommon(y),
    (a) =>
      run(() =>
        policyTx({
          client: a.client as string,
          instance: a.instance,
        })
      )
  )
  .demandCommand(1)
  .strict()
  .help()
  .parse()
