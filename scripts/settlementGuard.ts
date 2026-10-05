#!/usr/bin/env tsx
/**
 * OIV settlement guard (S1 interim fix) — ops tooling. Mechanism only: ops choose every
 * number. See `.claude/skills/oiv-settlement-guard/SKILL.md`.
 *
 *   yarn tsx scripts/settlementGuard.ts suggest <client> --down <pct> --up <pct> [--write]
 *   yarn tsx scripts/settlementGuard.ts check <client>
 *   yarn tsx scripts/settlementGuard.ts allowance-tx <client>
 *   yarn tsx scripts/settlementGuard.ts policy-tx <client>
 *
 * Every command takes `--instance` (default `manager_prod`). Reads the chain over RPC and
 * compiles policies locally; it never POSTs to a roles app and never sends a transaction.
 * Safe Transaction Builder files are written to ./export/.
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
import {
  callsPlannedForApplyRole,
  encodeCalls,
  rolesAbi,
} from "zodiac-roles-sdk"
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
const NEAR_EDGE_PCT = 1
const LOGS_API = "https://eth.blockscout.com/api"
const LOGS_PAGE = 1_000
const CLIENTS_DIR = path.join(__dirname, "..", "clients")
const EXPORT_DIR = path.join(__dirname, "..", "export")
const provider = providers[CHAIN_ID]

const sharesIface = new Interface([
  "function getApprovedAssets() view returns (address[])",
  "function getLastSettledPrice(address asset) view returns (uint256)",
  "function decimals() view returns (uint8)",
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
      `Unknown client "${client}": no single role with a settlement guard under clients/${client}/${ACCOUNT}/roles.\nClients with a settlement guard: ${listGuardedClients().join(", ") || "(none)"}`
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
    chainId: Number(mod.chainId),
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

// ---------------------------------------------------------------- chain reads

const read = async <T>(c: Contract, fn: string, ...args: unknown[]) =>
  (await c.getFunction(fn).staticCall(...args)) as T

const sharesContract = (shares: string) =>
  new Contract(shares, sharesIface, provider)

const rel = (p: string) =>
  path.relative(process.cwd(), p).split(path.sep).join("/")

const fmt = (x: bigint) => formatUnits(x, PRICE_DECIMALS)
const pct = (num: bigint, den: bigint) => (Number(num) / Number(den)) * 100

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
      `  ⚠️  approved but NOT pinned: ${notPinned.join(", ")} — settle it via the Manager Safe first, then extend settlementAssets`
    )
  if (notApproved.length)
    console.log(
      `  ⚠️  pinned but NOT approved on the shares: ${notApproved.join(", ")}`
    )
  if (!notPinned.length && !notApproved.length)
    console.log("  ✅ pin matches the approved assets")
  return approved
}

const lastSettledPrices = async (shares: string, assets: readonly string[]) => {
  const c = sharesContract(shares)
  const out: { asset: string; price: bigint }[] = []
  for (const asset of assets)
    out.push({
      asset,
      price: await read<bigint>(c, "getLastSettledPrice", asset),
    })
  return out
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
  const sub = sharesIface.getEvent("SubscriptionApproval")?.topicHash
  const red = sharesIface.getEvent("RedemptionApproval")?.topicHash
  // 0 = from genesis. The repo's public RPC refuses historical eth_getLogs, so
  // logs come from the Blockscout API (no key needed).
  const fromBlock =
    lookbackBlocks > 0
      ? Math.max(0, (await provider.getBlockNumber()) - lookbackBlocks)
      : 0
  const topics = [sub, red].filter((t): t is string => !!t)
  const txBlocks = new Map<string, number>()
  type Log = { transactionHash: string; blockNumber: string }
  const fetchPage = async (topic: string, from: number): Promise<Log[]> => {
    let reason = ""
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 2_000))
      const res = await fetch(
        `${LOGS_API}?module=logs&action=getLogs&address=${shares}&fromBlock=${from}&toBlock=latest&topic0=${topic}`
      )
      const body = (await res.json().catch(() => ({}))) as {
        result?: Log[] | null
        message?: string
      }
      if (Array.isArray(body.result)) return body.result
      reason = `HTTP ${res.status}${body.message ? ` ${body.message}` : ""}`
    }
    throw new Error(`logs API ${LOGS_API} failed twice (${reason})`)
  }
  for (const topic of topics) {
    // The API returns at most LOGS_PAGE logs per call: page with a block cursor
    // (overlapping on the last block; duplicates collapse in the map).
    let from = fromBlock
    for (;;) {
      const logs = await fetchPage(topic, from)
      for (const l of logs)
        txBlocks.set(l.transactionHash, Number(BigInt(l.blockNumber)))
      if (logs.length < LOGS_PAGE) break
      const last = Math.max(...logs.map((l) => Number(BigInt(l.blockNumber))))
      if (last <= from) break
      from = last
    }
  }
  const txs = [...txBlocks.entries()].sort((a, b) => b[1] - a[1])
  const out: Settlement[] = []
  for (const [hash, block] of txs.slice(0, count)) {
    const tx = await provider.getTransaction(hash)
    let found: Settlement = { block, tx: hash, via: "unrecognised" }
    if (tx?.to) {
      const sel = tx.data.slice(0, 10)
      const viaRole = rolesIface.getFunction("execTransactionWithRole")
      if (viaRole && sel === viaRole.selector) {
        const d = rolesIface.decodeFunctionData(viaRole, tx.data)
        const p = decodeProcessRequests(shares, d[0] as string, d[2] as string)
        if (p) found = { block, tx: hash, via: "bot (role)", ...p }
      } else if (sel === safeIface.getFunction("execTransaction")?.selector) {
        const d = safeIface.decodeFunctionData("execTransaction", tx.data)
        const p = decodeProcessRequests(shares, d[0] as string, d[2] as string)
        if (p) found = { block, tx: hash, via: "Safe direct", ...p }
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
  write: boolean
  history: number
  lookbackBlocks: number
}) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const pin = await loadPin(args.client, role)
  const toBps = (p: number, name: string, max: number) => {
    const b = Math.round(p * 100)
    if (!Number.isFinite(p) || b <= 0 || b >= max)
      throw new Error(`--${name} must be a percentage > 0 and < ${max / 100}`)
    return BigInt(b)
  }
  const downBps = toBps(args.down, "down", 10_000)
  const upBps = toBps(args.up, "up", 1_000_000)

  console.log(`${args.client} ${args.instance} (${role}) shares ${inst.shares}`)
  await approvedVsPin(inst.shares, pin)

  const prices = await lastSettledPrices(inst.shares, pin)
  for (const p of prices)
    console.log(`last settled price ${p.asset}: ${fmt(p.price)} (${p.price})`)
  const unsettled = prices.filter((p) => p.price === 0n)
  if (unsettled.length)
    throw new Error(
      `${unsettled.map((p) => p.asset).join(", ")} never settled on-chain (last settled price 0) — settle it via the Manager Safe first, then anchor the band`
    )
  const all = prices.map((p) => p.price)
  const low = all.reduce((a, b) => (a < b ? a : b))
  const high = all.reduce((a, b) => (a > b ? a : b))

  if (args.history > 0) {
    // History is informational: a failing logs source must not block the suggestion.
    try {
      const { settlements, totalTxs } = await settlementHistory(
        inst.shares,
        args.lookbackBlocks,
        args.history
      )
      console.log(
        `\nlast ${settlements.length} settlements (of ${totalTxs} settlement txs ${args.lookbackBlocks > 0 ? `in the last ${args.lookbackBlocks} blocks` : "since genesis"}):`
      )
      if (totalTxs === 0)
        console.log(
          "  none found — widen --lookbackBlocks (0 = from genesis) before choosing the band"
        )
      for (const s of settlements)
        console.log(
          `  block ${s.block}  ${s.price !== undefined ? fmt(s.price) : "n/a"}  ${s.asset ?? ""}  approve ${s.approve ?? "?"} / reject ${s.reject ?? "?"}  via ${s.via}  ${s.tx}`
        )
    } catch (e) {
      console.log(
        `\n⚠️  settlement history unavailable (${(e as Error).message.split("\n")[0]}) — check it on a block explorer before choosing the band`
      )
    }
  }

  // One anchoring rule: min from the lowest approved-asset price, max from the highest.
  const min = (low * (10_000n - downBps)) / 10_000n
  const max = (high * (10_000n + upBps) + 9_999n) / 10_000n
  console.log(
    `\nproposed band (-${args.down}% from the lowest, +${args.up}% from the highest last settled price):`
  )
  console.log(`  sharesPriceMin: "${min}"  (${fmt(min)})`)
  console.log(`  sharesPriceMax: "${max}"  (${fmt(max)})`)

  const current = tryGuard(inst.guard, `${args.client} ${args.instance}`)
  if (current.ok) {
    const cMin = BigInt(current.guard.sharesPriceMin)
    const cMax = BigInt(current.guard.sharesPriceMax)
    console.log(`current band: [${fmt(cMin)}, ${fmt(cMax)}]`)
    if (low < cMin || high > cMax)
      console.log(
        "  ❌ a live price is OUTSIDE the current band — the bot is blocked"
      )
    else if (
      pct(low - cMin, low) < NEAR_EDGE_PCT ||
      pct(cMax - high, high) < NEAR_EDGE_PCT
    )
      console.log(
        `  ⚠️  the anchor is within ${NEAR_EDGE_PCT}% of a current edge — re-centring now ratchets the band in the direction of the drift; check the history above first`
      )
  } else console.log(`current band: not configured (${current.reason})`)

  const ratio = Number(max) / Number(min)
  console.log(
    `\nworst case for a leaked bot key, as a share of the attacker's capital:`
  )
  console.log(
    `  per subscribe+redeem cycle (2 calls): ${((ratio - 1) * 100).toFixed(2)}%`
  )
  if (current.ok) {
    const n = current.guard.callAllowance.maxRefill
    const cycles = Math.floor(n / 2)
    console.log(
      `  per period with a full budget of ${n} calls = ${cycles} cycles (every ${current.guard.callAllowance.periodSeconds}s): ${((Math.pow(ratio, cycles) - 1) * 100).toFixed(2)}%  = (max/min)^floor(N/2) - 1`
    )
    console.log(
      "  real cap: the cash an attacker can actually redeem — keep idle cash on the Portfolio Safe minimal"
    )
  } else
    console.log("  per period: set callAllowance in the instance to see it")

  if (args.write) {
    let src = fs.readFileSync(inst.file, "utf8")
    const set = (field: string, value: bigint) => {
      const re = new RegExp(`(${field}:\\s*)(TODO_OPS|"[0-9]+")`)
      if (!re.test(src)) throw new Error(`${field} not found in ${inst.file}`)
      src = src.replace(re, `$1"${value}"`)
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

const check = async (args: { client: string; instance: string }) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const rolesMod = inst.rolesMod
  const pin = await loadPin(args.client, role)
  console.log(
    `${args.client} ${args.instance} (${role}) — roles mod ${rolesMod}`
  )
  await approvedVsPin(inst.shares, pin)

  const g = tryGuard(inst.guard, `${args.client} ${args.instance}`)
  const prices = await lastSettledPrices(inst.shares, pin)
  if (g.ok) {
    const min = BigInt(g.guard.sharesPriceMin)
    const max = BigInt(g.guard.sharesPriceMax)
    console.log(`\nband [${fmt(min)}, ${fmt(max)}]`)
    for (const p of prices) {
      const toFloor = pct(p.price - min, p.price)
      const toCeil = pct(max - p.price, p.price)
      const flag =
        p.price < min || p.price > max
          ? "❌ OUTSIDE — the bot is blocked"
          : toFloor < NEAR_EDGE_PCT || toCeil < NEAR_EDGE_PCT
            ? `⚠️ within ${NEAR_EDGE_PCT}% of an edge — plan a re-centre`
            : "✅"
      console.log(
        `  ${p.asset} ${fmt(p.price)}  ${toFloor.toFixed(2)}% above floor, ${toCeil.toFixed(2)}% below ceiling  ${flag}`
      )
    }
  } else {
    console.log(`\nband: not configured (${g.reason})`)
    for (const p of prices) console.log(`  ${p.asset} ${fmt(p.price)}`)
    if (inst.guard === undefined) {
      console.log(
        `\n${args.client} ${args.instance} has no settlementGuard, so it is not guarded and there is no allowance to check (only the settlement role's manager instances carry it${args.client === "eth-alpha-fund" && args.instance === "manager_stage" ? "; eth-alpha manager_stage is excluded by decision" : ""}).`
      )
      return
    }
  }

  const a = await readAllowance(rolesMod)
  const block = await provider.getBlock("latest")
  const now = BigInt(block?.timestamp ?? Math.floor(Date.now() / 1000))
  console.log(
    `\nallowance "processRequests-calls" on ${rolesMod}: refill ${a.refill}, maxRefill ${a.maxRefill}, period ${a.period}s, stored balance ${a.balance}, timestamp ${a.timestamp}`
  )
  if (isUnset(a)) {
    console.log(
      "  ❌ UNSET — every bot call reverts (CallAllowanceExceeded). Run allowance-tx."
    )
    return
  }
  const { balance, nextRefill } = accrue(a, now)
  if (balance === 0n)
    console.log(
      `  ❌ EXHAUSTED — balance 0; next refill ${nextRefill === undefined ? "never (period 0)" : `at ${new Date(Number(nextRefill) * 1000).toISOString()}`}`
    )
  else console.log(`  available now: ${balance} call(s)`)
  if (g.ok) {
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

// Safe Transaction Builder JSON, same shape as scripts/applyExport.ts (+ `data`).
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
      data: call.data,
      contractMethod: {
        inputs: mapInputs(abiEntry?.inputs) ?? [],
        name: parsed.name,
        payable: false,
      },
      contractInputsValues: serialize(parsed.args, parsed.fragment.inputs),
    }
  }),
})

const writeExport = (file: string, json: unknown) => {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
  const out = path.join(EXPORT_DIR, file)
  fs.writeFileSync(out, JSON.stringify(json, null, 2))
  return out
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
    `${args.client}_${args.instance}_${rolesMod.slice(0, 10)}_setAllowance.json`,
    toTxBuilder(
      `${args.client} ${args.instance}: settlement guard call allowance`,
      `setAllowance(processRequests-calls) on ${rolesMod}`,
      inst.avatar,
      [{ to: rolesMod, data }]
    )
  )
  console.log(`wrote ${rel(out)} — Safe ${inst.avatar}`)
}

const policyTx = async (args: { client: string; instance: string }) => {
  const role = resolveRole(args.client)
  const inst = await loadInstance(args.client, args.instance)
  const rolesMod = inst.rolesMod
  await assertOwner(rolesMod, inst.avatar)
  // Compiles the role exactly as `yarn apply` would, locally (no roles app, no indexer).
  const { targets, roleKey } = await compileApplyData({
    clientArg: args.client,
    accountArg: `${ACCOUNT}/${args.instance}`,
    roleArg: role,
  })
  const key = encodeBytes32String(roleKey) as `0x${string}`
  // Plan against an empty role and encode offline (planApplyRole would query the
  // Roles indexer even with an explicit `current`). An empty `current` re-issues
  // scopeTarget (harmless) and the full scopeFunction; members and annotations
  // are not touched.
  const empty = {
    key,
    members: [],
    targets: [],
    annotations: [],
    lastUpdate: 0,
  }
  const calls = encodeCalls(
    callsPlannedForApplyRole(empty, { ...empty, targets }),
    rolesMod as `0x${string}`
  )
  for (const call of calls) {
    const p = rolesIface.parseTransaction({ data: call.data })
    console.log(
      `  ${p?.name}(${p?.name === "scopeFunction" ? `${p.args[1]}, ${p.args[2]}, ${(p.args[3] as unknown[]).length} conditions` : String(p?.args[1] ?? "")})`
    )
  }
  const out = writeExport(
    `${args.client}_${args.instance}_${rolesMod.slice(0, 10)}_${role}_policy.json`,
    toTxBuilder(
      `${args.client} ${args.instance}: ${role} policy with settlement guard`,
      `${role} on ${rolesMod}`,
      inst.avatar,
      calls.map((c) => ({ to: rolesMod, data: c.data }))
    )
  )
  console.log(`wrote ${rel(out)} — Safe ${inst.avatar}`)
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

const run = (fn: () => Promise<void>) =>
  fn().catch((e: Error) => {
    console.error(`\n❌ ${e.message}`)
    process.exit(1)
  })

yargs(process.argv.slice(2))
  .scriptName("yarn tsx scripts/settlementGuard.ts")
  .command(
    "suggest <client>",
    "propose a band from the last settled prices",
    (y) =>
      withCommon(y)
        .option("down", {
          type: "number",
          demandOption: true,
          describe: "% below the lowest last settled price",
        })
        .option("up", {
          type: "number",
          demandOption: true,
          describe: "% above the highest last settled price",
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
        }),
    (a) =>
      run(() =>
        suggest({
          client: a.client as string,
          instance: a.instance,
          down: a.down,
          up: a.up,
          write: a.write,
          history: a.history,
          lookbackBlocks: a.lookbackBlocks,
        })
      )
  )
  .command(
    "check <client>",
    "band position and on-chain allowance vs the instance config",
    (y) => withCommon(y),
    (a) =>
      run(() =>
        check({
          client: a.client as string,
          instance: a.instance,
        })
      )
  )
  .command(
    "allowance-tx <client>",
    "Safe Tx Builder JSON for setAllowance (./export/)",
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
    "Safe Tx Builder JSON for the guarded policy, compiled locally (./export/)",
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
