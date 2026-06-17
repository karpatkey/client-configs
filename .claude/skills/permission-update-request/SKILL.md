---
name: permission-update-request
description: >
  Create a Pull Request on the client-configs repo that adds, modifies, or
  removes permission policies for a client role (the Zodiac Roles Modifier
  policy in clients/<client>[/<account>]/<network>/roles/<ROLE>/permissions). Use whenever
  someone wants to make a Permission Change Request as a PR — e.g. "whitelist
  Aave deposit for ens-dao MANAGER", "add a CoW swap for the fund", "open a
  policy PR", "implement this permission change spreadsheet". Walks through the
  preliminary check, building the change with DeFi-Kit / typed-presets,
  validating, and opening the PR.
---

# Permission Update Request

This skill turns a permission change request into a Pull Request against the
`client-configs` repo. It encodes the two reference docs:

- **Client Onboarding Process** — the lifecycle: Deploy → Test → Connect → Activate → Iterate.
- **Permission Change Request Guidelines (Ops → Ops Engineering)** — how a request is specified and where it lives in this repo.

Your job with this skill is the **Implementation** stage: translate a request into
code in `client-configs`, validate it, and open the PR. Testing on-chain (Pilot
Extension / Tenderly) stays with the requester after the PR produces a payload.

> 🛑 **Never guess — ask.** These are on-chain permission policies; a wrong scope
> is a security risk. If anything about the exact policy is unclear or
> underspecified, **stop and ask the user** rather than inferring it. This
> includes (non-exhaustive): which client / network / role / instance; whether
> it's New / Modify / Remove; the exact protocol, action, market/pool, tokens,
> targets, and direction; recipient/destination addresses; allowance limits;
> token/contract addresses you can't confirm in the repo; the action's argument
> shape; and how a new role wires into instances. Do not invent addresses,
> action names, argument values, or `targets`. Confirm the final entry with the
> user before committing. When in doubt, ask — never fill a gap with a plausible
> guess.

---

## 0. Understand the request

Every permission change resolves to four coordinates plus a change type. Get these
up front (from the user, a filled spreadsheet, or the Google Form export). If any
are missing or ambiguous, ask.

| Field       | Meaning                        | Example                                             |
| ----------- | ------------------------------ | --------------------------------------------------- |
| **Client**  | Avatar Safe owner / client dir | `ens-dao`, `aleph`, `eth-alpha-fund`                |
| **Network** | account folder                 | `mainnet`, `gnosis`, `arbitrum`, `base`, `optimism` |
| **Role**    | role being changed             | `MANAGER`, `DISASSEMBLER`, `HARVESTER`, …           |
| **Type**    | `New` / `Modify` / `Remove`    | `New`                                               |
| **What**    | the protocol action(s)         | "Aave v3 Core: deposit USDC, withdraw USDC"         |

> 🔎 **Resolve the Avatar Safe first.** Requests identify the target by **Avatar
> Safe** (a client can have several — different accounts/mandates). Map it to the
> right `client/[account]/network/instance` by grepping the address across
> `clients/**` (e.g. `clients/<client>/addresses.ts`, the instance files) before
> editing — this is how you find the correct (possibly account-layered) path.

The request usually falls into one of the four spreadsheet categories — they map to
the same code, just different helpers:

- **Positions** — AMMs, DEXes, lending, staking, LPing (most DeFi-Kit actions). The request gives a _Pool_ (AMM/DEX) or _Market_ (lending) → map it to the action's `targets` / `market`.
- **Swaps** — almost always **CoW Swap** (`allow.<chain>.cowSwap…` or `allowAction.cowswap.swap`). Same sell+buy list ⇒ **two-way**; differing lists ⇒ **one-way**. **Before adding a new swap, check the swaps already in the policy and prefer merging/broadening** the sell+buy lists into an existing entry — leave standalone swaps only for specific cases. This keeps the policy within the **ZRM limit on the number of combinations**. Not every swap can be added; CoW Swap is prioritised.
- **Transfers** — ERC-20 / native transfers to specific destinations. Consider an **Allowance** (spend limit + timeframe) — note it in the PR.
- **Bridge** — Gnosis Bridge, Stargate, CCTP, Hop, etc. Pin the **source token, destination token, and recipient**. Bridge the **same asset** end-to-end; when the bridge auto-converts (e.g. USDC→USDC.e, DAI→XDAI on the Gnosis Bridge), call it out explicitly. Consider an Allowance.

---

## 1. Preliminary check — does the permission already exist?

**Always do this first.** It avoids duplicate entries and tells you whether the
change is `New`, `Modify`, or `Remove`.

> 📁 **Directory layout — mind the optional `<account>` segment.** Most clients are
> `clients/<client>/<network>/roles/<ROLE>/…`, but some (e.g. `cow`, `gnosis-dao`)
> insert an **account** layer: `clients/<client>/<account>/<network>/roles/<ROLE>/…`
> (e.g. `clients/cow/main/mainnet/...`, `clients/cow/defense/gnosis/...`). Confirm
> the real path with `yarn list-configs`; don't assume the flat shape. Because the
> depth varies, **copy the relative `parameters` import (`../../../parameters` vs
> deeper) from a sibling permissions file** rather than hardcoding it.

```
clients/<client>[/<account>]/<network>/roles/<ROLE>/permissions/
  _actions.ts   # DeFi-Kit Actions (protocols already integrated, pre-audited)
  calls.ts      # Typed-Presets / ad-hoc permissions (protocols not in DeFi-Kit)
```

Read both files for the target role and grep for the protocol/token/contract — and
grep **across all clients** for an existing implementation you can copy (see §2):

```bash
ls clients/<client>/.../roles/<ROLE>/permissions/
grep -rin "<protocol-or-token>" clients/   # any client's precedent, not just this role
```

- If the exact permission is already there → tell the user; no PR needed (or only a tweak).
- For `Modify`/`Remove` → quote the exact line(s) you'll change so the user can confirm.

> ⚠️ The repo is the best reference but may lag on-chain state (a PUR may not be
> applied yet). It's still the source of truth for building the PR.

Useful discovery commands:

```bash
yarn list-configs                 # all clients / networks / instances / roles
git log --oneline -- clients/<client>/<network>/roles/<ROLE>   # recent changes
```

If the role directory doesn't exist yet, this is a **new role** — see §3c.

---

## 2. Decide: DeFi-Kit action (`_actions.ts`) or typed-preset (`calls.ts`)?

- **Prefer DeFi-Kit (`_actions.ts`)** whenever the protocol+action is supported.
  It's pre-audited, scoped, and reusable. Check coverage at
  **https://kit.karpatkey.com/learn** (Protocols and Bridges sections list the
  available Action Bundles). When unsure, use WebFetch on that page.
- **Use `calls.ts`** (typed-presets / ad-hoc) only for protocols/functions **not**
  covered by DeFi-Kit, or where you need a hand-scoped call. For a protocol that
  isn't in DeFi-Kit at all, follow **§3e New protocol** — it must be scoped via
  typed-presets after analysing the protocol's docs, source, ABIs, and audits.

Both files export a function `(parameters: Parameters) => [...]`. Add your entry to
the returned array with a clear `//` comment describing the action — match the
surrounding comment style exactly.

> 📐 **Sort everything alphabetically.** Keep entries ordered alphabetically —
> imports, token/address lists, and the permission entries themselves (grouped by
> protocol, protocols A→Z, and within a protocol by action/target). Insert new
> entries in their correct alphabetical position rather than appending to the end,
> and keep any import statements you touch alphabetically sorted too.

> 🔁 **Copy an existing implementation — don't invent one.** Before scoping
> anything, search the whole repo for how the same protocol/action is already done
> in _other_ clients and copy that exact pattern (call shape, helpers, conditions,
> comment style, address-key names): `grep -rn "<protocol>" clients` /
> `grep -rn "allowAction.<protocol>" clients`. A reviewed precedent almost always
> exists and beats writing a fresh scope. **The request's "Protocol" / "Category"
> label can be misleading — let the repo precedent win over the literal label.**
> For example, a request tagged "CoW Swap" for XDAI/WXDAI is really a plain
> wrap/unwrap on the WXDAI contract (`allow.gnosis.wxdai.deposit({ send: true })`
> and `allow.gnosis.wxdai.withdraw()`), the pattern other gnosis policies use — not
> a `cowswap.swap`. When the request and precedent disagree, surface it and ask.

---

## 3. Build the change

### 3a. DeFi-Kit actions — `_actions.ts`

The import is chain-specific. Pick by the network folder:

| Network folder | DeFi-Kit import                                       |
| -------------- | ----------------------------------------------------- |
| `mainnet`      | `import { allow as allowAction } from "defi-kit/eth"` |
| `gnosis`       | `defi-kit/gno`                                        |
| `arbitrum`     | `defi-kit/arb1`                                       |
| `base`         | `defi-kit/base`                                       |
| `optimism`     | `defi-kit/oeth`                                       |

```ts
import { allow as allowAction } from "defi-kit/eth"
import { USDC, WETH } from "@/addresses/eth"
import { Parameters } from "../../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
]
```

The exact action name, parameters, and allowed `targets` come from the DeFi-Kit
docs for that protocol. Don't guess argument shapes — confirm against
kit.karpatkey.com/learn or existing usages in the repo (`grep -rn "allowAction.<protocol>" clients`).

### 3b. Typed-presets / ad-hoc — `calls.ts`

```ts
import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { eAddress } from "@/addresses"
import { rsETH, stETH, ETHx } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 - Withdraw rsETH to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(rsETH, undefined, c.avatar),

    // Kelp - Approve rsETH to the WithdrawalManager
    allowErc20Approve([rsETH], [contracts.mainnet.kelp.lrtWithdrawalManager]),

    // Kelp - Initiate withdrawal redeeming for ETH, ETHx or stETH
    allow.mainnet.kelp.lrtWithdrawalManager.initiateWithdrawal(
      c.or(eAddress, ETHx, stETH)
    ),
  ] satisfies PermissionList
```

The `allow.<chain>` namespace tracks the network folder:

| Network folder | namespace           |
| -------------- | ------------------- |
| `mainnet`      | `allow.mainnet`     |
| `gnosis`       | `allow.gnosis`      |
| `arbitrum`     | `allow.arbitrumOne` |
| `base`         | `allow.base`        |
| `optimism`     | `allow.optimism`    |

Building blocks:

- **Scoping conditions** — `c` from `zodiac-roles-sdk` (`c.avatar`, `c.or(...)`, `c.eq`, etc.). `c.avatar` restricts a recipient to the client's Avatar Safe.
- **Token approvals** — `allowErc20Approve([tokens], [spenders])` from `@/helpers`.
- **Native ETH transfers** — `allowEthTransfer` from `@/helpers`.
- **Contracts** — `contracts.<chain>.<protocol>.<contract>` from `@/contracts` (the eth-sdk config).
- **Token / known addresses** — from `@/addresses/<chain>` (e.g. `@/addresses/eth`). `@/addresses` also exports common constants like `eAddress` (the ETH sentinel `0xEeee…`).

### 3c. New role (directory doesn't exist)

Create the full structure mirroring an existing role:

```
clients/<client>[/<account>]/<network>/roles/<ROLE>/
  members.ts          # array of member EOAs/Safes that hold the role
  permissions/
    _actions.ts       # export default (parameters: Parameters) => []
    calls.ts          # export default (parameters: Parameters) => [] satisfies PermissionList
```

`members.ts` example: `export default ["0x…"]` (leave `[]` only if members are
supplied later — confirm with the requester). A role also has to be wired into the
client's instance(s) under `clients/<client>[/<account>]/<network>/instances/*.ts`;
check how peer roles are referenced and replicate. If wiring is non-obvious, ask
before inventing it.

### 3d. Missing tokens or contracts

If an address isn't exported yet:

- **Tokens / addresses** → add to `eth-sdk/addresses/<chain>.ts` (e.g. `eth.ts`).
- **Contracts (with ABIs)** → register in `eth-sdk/config.ts` and run `yarn setup`
  to regenerate typings before referencing `contracts.<chain>.…`.
- **DeFi-Kit target not recognized** — if a vault/market/pool that should be a
  valid `targets:` value isn't accepted, the `defi-kit` package itself may need
  bumping to the release that registers that target. Update `defi-kit` in
  `package.json`, reinstall, and re-check. (A newly-listed Morpho vault, for
  example, only resolves once `defi-kit` is on the version that registers it.)

Keep additions minimal and alphabetically consistent with the surrounding entries.

### 3e. New protocol (not in DeFi-Kit)

A protocol that isn't integrated in DeFi-Kit **must go through typed-presets /
ad-hoc calls in `calls.ts`** — it will not be available as a DeFi-Kit action.
Scoping a brand-new protocol by hand is the highest-risk path in this skill, so
do not improvise it. Gather and analyse the protocol's real interface first, then
scope the minimum necessary functions.

**Ask the user for the source material — don't hunt blindly or assume.** Request links to:

- **Contract addresses** — the exact deployed addresses on the target network (and confirm they're the canonical/verified ones).
- **Official docs** — the protocol's documentation for the functions in scope.
- **GitHub / source code** — the repo, ideally the exact contracts and version/commit deployed.
- **ABIs** — the verified ABI (from the explorer or repo) for each contract.
- **Audits** — audit reports, to understand trust assumptions and known risks.
- **Sample transactions** — Etherscan/Tenderly examples of the action executed through a Safe.

Then **read and analyse** that material before writing anything:

- Read the docs, source, and ABIs to understand exactly what each function does, its parameters, and side effects (token movements, approvals, recipients, who can call it).
- Cross-check the ABI against the verified on-chain contract and the audits — flag anything that doesn't line up.
- Identify the **minimal** set of functions the requested action actually needs.
- Determine, per function, which arguments must be **pinned** (e.g. recipient = `c.avatar`, specific token, specific pool) versus left open, so the policy can't be abused (no draining to arbitrary addresses, no unintended approvals, etc.).

**Feed all of this into the clarifying questions to the user** (per the "Never
guess" principle) so the final scoping is precise and secure — e.g. "should
withdrawals only ever go to the Avatar Safe?", "which tokens/pools are in scope?",
"is this approval bounded by an allowance?". Only once the exact scope is confirmed:

1. Register the contract(s) + verified ABI(s) in `eth-sdk/config.ts`; run `yarn setup`.
2. Scope the ad-hoc call(s) in `calls.ts` using `c` conditions (`c.avatar`, `c.eq`, `c.or`, allowances, etc.), pinning every argument that should be constrained.
3. Validate with `yarn apply` and review the diff carefully.
4. In the PR, flag it as a **new, hand-scoped protocol** that needs Ops Engineering security review, link all the source material (docs / repo / ABIs / audits / sample txs), and note whether it's a candidate for proper DeFi-Kit integration.

---

## 4. Validate before opening the PR

Run, in order, and fix anything that fails:

```bash
yarn check:types                                              # tsc --noEmit
npx prettier --write <changed-files>                          # format ONLY what you touched
yarn apply <client>(/<account>) <network>(/<instance>) <ROLE> # compile + preview in Roles app
```

- `yarn apply …` compiles the policy and opens the **Zodiac Roles app** for a
  visual diff and the **transaction payload** — this is the deliverable the
  requester uses to test (Pilot Extension / Tenderly) and execute. Use
  `yarn apply:export …` to instead write the payload JSON to `./export/`.
- The first arg carries the **account** layer when the client has one
  (`cow/main`, `gnosis-dao/illiquid-assets`); the second is `<network>(/<instance>)`.
  Instance defaults to `main` — pass `<network>/<instance>` for others (e.g.
  `mainnet/test`, `mainnet/sub_reth`). `yarn list-configs` shows valid values.
- **Format only the files you changed** (`npx prettier --write <files>`) — don't
  reformat the whole repo, or you'll sweep unrelated churn into the PR.
- `yarn check:types` may surface **pre-existing** errors in unrelated/untracked
  helper scripts; those aren't yours — confirm only that the files you changed are
  error-free.
- If the role has a `permissions.test.ts`, run `yarn test` (spins up an anvil
  fork). Add/extend tests for non-trivial scoping when it makes sense.

Report the apply/diff result to the user so they can sanity-check the change
matches intent.

---

## 5. Open the Pull Request

Confirm the change with the user, then:

```bash
git checkout main && git pull --ff-only
git checkout -b <client>-<short-desc>             # e.g. ens-dao-manager-aave-usdc
# Stage ONLY the files this change touches (the permission policy + any
# address/contract additions). Do NOT use `git add -A` — it would sweep in
# unrelated working-tree changes (dependency manifests, lockfiles, local
# scripts/config) that must not land in the PR.
git add clients/<client>/.../permissions/*.ts     # + eth-sdk/addresses/<chain>.ts, etc.
git commit            # see message format below
git push -u origin HEAD
gh pr create --base main --fill
```

> A branch/PR for this work may already exist — check first
> (`gh pr list --head <branch>`, `git ls-remote --heads origin`); if so, push to it
> and update its description instead of opening a duplicate. One PR may also bundle
> **multiple** related requests (different roles, networks, or accounts) — give
> each change its own client / network / role / type block in the body.

**Branch name:** `<client>-<short-description>` (kebab-case), matching repo
convention (e.g. `usd-prime-fund-updates`, `renaissance-fund-instances`).

**Commit / PR message** — describe the change in terms of client, role, network,
and the actions whitelisted/removed. End the commit message with the required
trailer:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

End the PR body with:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**PR body format.** Mirror the team's recent permission PRs. Lead with a
`| Field | Value |` table, then group actions by the file they live in, then the
removals, dependency changes, and validation. Use **one block per change** — a PR
may bundle several (different roles / networks / accounts):

```markdown
## Permission Change Request — <account>/<network>

| Field           | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Client**      | <client>                                                  |
| **Account**     | <account> _(omit row if the client has no account layer)_ |
| **Network**     | <network>                                                 |
| **Role**        | <ROLE>                                                    |
| **Avatar Safe** | `0x…`                                                     |
| **Type**        | New / Modify / Remove (+ combos)                          |

### Actions added

**DeFi-Kit actions — `_actions.ts`**

- **<Protocol>** — <action> (market / target / tokens), with the registry key or address.

**Ad-hoc (typed-preset) — `calls.ts`**

- **<Protocol>** — <function(s)>, noting which args are **pinned** (e.g. recipient = avatar Safe) vs left open.

### Removed

- **<entry>** — what and why (quote the exact line for Modify/Remove).

### Address / dependency changes

- New token/contract consts added to `eth-sdk/...`; any `defi-kit` version bump.

### Validation

- `yarn check:types` — passes (only pre-existing errors in unrelated scripts).

> ⚠️ **Security review** — flag any new/hand-scoped contracts for Ops Engineering, with source/ABI/audit links.

> The `yarn apply` payload still needs **Pilot Extension / Tenderly** testing before execution.
```

Also always include, when applicable: any **Allowance** (amount + timeframe) for
Transfers/Bridge, and sample transactions (Etherscan/Tenderly) the requester
provided. Keep the body to the public tooling vocabulary (the Zodiac Roles app,
`yarn apply` / `yarn apply:export`) — don't document local environment specifics.

> Only push and open the PR once the user has confirmed the change. Never execute
> on-chain transactions — the skill stops at producing the PR + payload.

---

## Quick reference

| Thing                      | Where                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Permission files           | `clients/<client>[/<account>]/<network>/roles/<ROLE>/permissions/{_actions.ts,calls.ts}` |
| Role members               | `clients/<client>[/<account>]/<network>/roles/<ROLE>/members.ts`                         |
| Instances (wiring)         | `clients/<client>[/<account>]/<network>/instances/*.ts`                                  |
| Token addresses            | `eth-sdk/addresses/<chain>.ts` (alias `@/addresses/*`)                                   |
| Contracts + ABIs           | `eth-sdk/config.ts` (alias `@/contracts`); `yarn setup` to regenerate                    |
| Helpers                    | `helpers/` (`allowErc20Approve`, `allowEthTransfer`) via `@/helpers`                     |
| Types                      | `@/types` (`PermissionList`)                                                             |
| DeFi-Kit coverage          | https://kit.karpatkey.com/learn                                                          |
| Allowances                 | https://docs.roles.gnosisguild.org/general/allowances                                    |
| List configs               | `yarn list-configs`                                                                      |
| Compile + preview          | `yarn apply <client>(/<account>) <network>(/<instance>) <ROLE>`                          |
| Export payload             | `yarn apply:export <client>(/<account>) <network>(/<instance>) <ROLE>`                   |
| Type check / format / test | `yarn check:types` · `npx prettier --write <files>` · `yarn test`                        |
