---
name: oiv-settlement-guard
description: >
  Set, re-centre or check the OIV settlement guard (S1 interim fix) on a fund's
  `processRequests` permission: the inclusive price band on `sharesPriceInAsset`
  and the call budget (CallWithinAllowance "processRequests-calls") on the fund's
  manager Roles Modifier. Use whenever someone wants to "set the price band for
  kUSD", "re-centre the band", "the settlement bot reverts with
  ConditionViolation", "change the processRequests call limit", "check the guard
  on XAUt", or to build the Manager Safe payload for any of that — for funds in
  this repo (usd-alpha, eth-alpha, xaut-carry, wbtc-carry) or, exceptionally,
  for a fund truly outside it.
---

# OIV Settlement Guard

`kpkShares.processRequests(approve[], reject[], asset, sharesPriceInAsset)` only
compares each price with the previous call (±30%), and every call — even with
empty arrays — resets that reference. A leaked settlement-bot key could therefore
walk the share price anywhere and mint itself most of the supply ("S1"). Until
the contract is fixed and upgraded, the bot's permission carries a **guard**:

- **Price band** — `sharesPriceInAsset` must lie in `[sharesPriceMin, sharesPriceMax]`
  (inclusive).
- **Call budget** — every successful call spends one unit of the allowance
  `processRequests-calls`, which refills every period.

Both live on the fund's **manager Roles Modifier** (`instances/manager_*.ts`);
the fund's **Manager Safe** owns that modifier and signs.

> 🛑 **Never execute on-chain and never POST.** This skill stops at a PR plus Safe
> Transaction Builder files in `./export/`. Do not run `yarn apply` /
> `yarn apply:export` for this work (they publish the policy to a roles app); use
> the local commands below. Ops — not you — sign and execute through the Manager
> Safe after review and fork tests.

## Golden rule: ops choose every number

Never pick the band, the budget, the period, or reuse a number from anywhere
else. Ask. If ops are unsure, show them the data and the trade-off below and let
them decide. The repo ships **no** defaults: every value is `TODO_OPS`, which
fails `yarn check:types` and throws at compile time until replaced.

### Number formats

| Field                                 | Format                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `sharesPriceMin` / `sharesPriceMax`   | integer **string**, 8-decimal fixed point (price × 10⁸) — the unit of `getLastSettledPrice` |
| `balance` / `maxRefill` / `refill`    | integer **number** of calls (`maxRefill`, `refill` > 0)                                     |
| `periodSeconds`                       | integer **number** of seconds (> 0)                                                         |
| `--down` / `--up` (`suggest`)         | percentage, up to two decimals                                                              |
| `--anchorPrice` (`suggest`, optional) | integer, 8-decimal fixed point, like the prices                                             |

### Trade-off (computed by `suggest` for the numbers ops propose)

With `r = max/min`:

| Exposure for a leaked bot key | Formula                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------- |
| per subscribe+redeem cycle    | `r − 1` (2 calls)                                                                 |
| **burst** (within seconds)    | `N = max(balance, maxRefill) + min(refill, maxRefill)` calls → `r^floor(N/2) − 1` |
| sustained, per period         | `refill` calls → `r^floor(refill/2) − 1`                                          |
| real cap                      | idle cash an attacker can redeem from the Portfolio Safe                          |

Be honest with ops about what this does and doesn't bound:

- **Rounds compound inside the budget.** Each subscribe-low / redeem-high round
  multiplies the attacker's capital by up to `max/min`. The **burst** figure —
  the whole bucket spent just before a refill plus the refill right after — is
  the real exposure, not the per-cycle one.
- **One call can approve many request ids**, so the budget caps the number of
  rounds, not the volume per round.
- **The binding cap is the cash on the Portfolio Safe** an attacker can redeem.
  Make _keeping idle cash minimal and funding redemptions just in time_ part of the
  control, not an afterthought.
- A **wider band** re-centres less often but leaks more per round; a **larger
  budget** tolerates settlement peaks but compounds more rounds. The budget must
  still exceed the real peak of settlement calls per period, or the bot stalls.
  `suggest`'s history only lists calls that approved a request: reject-only and
  empty calls also spend budget, so ask ops how the bot really calls.

## Facts that never change

- **Allowance key**: `encodeBytes32String("processRequests-calls")`
  (`SETTLEMENT_GUARD_ALLOWANCE_KEY` in `helpers/settlementGuard.ts`). Fixed; ops
  never choose it.
- **`yarn apply` does not set allowance amounts.** The policy only references the
  key. Without `setAllowance` the budget is 0 and every bot call reverts with
  `CallAllowanceExceeded` (safe, but a stopped bot). The first time, always ship
  **both**: the policy (`scopeFunction`) and the allowance (`setAllowance`).
- **`setAllowance(key, balance, maxRefill, refill, period, timestamp)`** creates or
  overwrites the allowance in one call (selector `0xa8ec43ee`; note the getter
  `allowances(key)` returns `refill, maxRefill, period, balance, timestamp`).
  - `timestamp = 0` → periods start at execution.
  - `maxRefill = 0` means _unlimited_ on the Roles modifier → rejected by the
    validator.
  - Re-setting **overwrites the balance** (an instant refill).
- **Order.** Inside one Safe batch the order doesn't matter (atomic). As separate
  transactions, execute **`setAllowance` before `scopeFunction`**, otherwise the
  bot is blocked in between. **Re-centring the band needs no new `setAllowance`.**
- **Asset pin.** The role keeps it (`settlementAssets` in the role's `calls.ts`).
  When a new asset is approved on the shares, the Manager Safe settles it first;
  only then extend `settlementAssets` and re-check the band. `suggest` and `check`
  cross-check the pin against `shares.getApprovedAssets()`.
- **The repo follows the chain.** Work locally; push nothing that was not
  executed. But every band or budget that **is** executed lands in the repo as a
  PR (the instance file). Once a guard is live, build that role only from a ref
  that contains it: compiling from an older ref (a PUR branch cut before the
  guard, a stale fork) silently drops or rewinds the guard.

## Where things live

| What                                 | Where                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Numbers (ops)                        | `clients/<fund>/mainnet/instances/manager_prod.ts` (and `manager_stage.ts`) → `settlementGuard` |
| Config type + validation + condition | `helpers/settlementGuard.ts`                                                                    |
| Guarded permission                   | `clients/<fund>/mainnet/roles/<REQUESTS\|APPROVER>/permissions/calls.ts`                        |
| Tooling                              | `scripts/settlementGuard.ts` (`yarn tsx scripts/settlementGuard.ts …`)                          |
| Tests                                | `clients/<fund>/mainnet/roles/<ROLE>/permissions.test.ts`                                       |

Funds and roles: `usd-alpha-fund` / `eth-alpha-fund` → `REQUESTS`;
`xaut-carry-fund` / `wbtc-carry-fund` → `APPROVER`.

## Commands

All are `yarn tsx scripts/settlementGuard.ts <command> <fund> [options]`; every
command takes `--instance <name>` (default `manager_prod`); `--help` lists the rest.

| Command        | Does                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `suggest`      | `--down <pct> --up <pct>` (required). Anchors on the last settled prices of the assets that are both approved and pinned (min from the lowest, max from the highest), or on `--anchorPrice`. Prints the history (`--history`, `--lookbackBlocks`), the current band, a ratchet warning (`--nearEdge`, fraction of the band width), the worst cases. `--write` fills `sharesPriceMin/Max` in the instance file. |
| `policy-tx`    | Compiles the role exactly as `yarn apply` would and encodes it locally: `scopeTarget` + `scopeFunction` per function. No roles app, no indexer.                                                                                                                                                                                                                                                                |
| `allowance-tx` | `setAllowance` for the configured budget; prints the on-chain allowance next to the new one.                                                                                                                                                                                                                                                                                                                   |
| `check`        | Reads the **live** policy from the modifier's events (guarded? which band? wildcarded?), the last settled prices vs the band, and the allowance (unset / exhausted / next refill) vs the instance file.                                                                                                                                                                                                        |

`policy-tx` and `allowance-tx` refuse a modifier not owned by the instance avatar,
and each writes `export/<fund>_<instance>_<mod>_….json` (Safe Transaction Builder,
decoded arguments) plus `….raw.json` (`to` + calldata, for fork tests).

## Case A — the fund is in this repo (default)

Work on a local branch; nothing is pushed until it is executed (see "The repo
follows the chain").

1. **Get the band from ops** (`--down` / `--up` in %, their choice):
   ```bash
   yarn tsx scripts/settlementGuard.ts suggest <fund> --down <X> --up <Y>
   ```
   Check the anchor against the fund's NAV before trusting it: the bot can move
   `getLastSettledPrice` anywhere inside a live band (even with empty arrays),
   and the value goes stale while the bot is blocked by the band — then anchor
   on the NAV with `--anchorPrice`. An asset approved on the shares but never
   settled (price 0) blocks `suggest` until it is settled or `--anchorPrice` is
   given. Re-run with `--write` once ops agree.
2. **Set the budget** by hand in the same `settlementGuard` block (ops choose
   `balance`, `maxRefill`, `refill`, `periodSeconds`), and delete the instance's
   `TODO_OPS` import when no placeholder is left (`--write` does it when it
   fills the last one). Re-run `suggest` (without `--write`) to show ops the
   burst and sustained worst case for that budget.
3. **Build the Manager Safe files** (local only, written to `./export/`):
   ```bash
   yarn tsx scripts/settlementGuard.ts policy-tx    <fund>   # scopeTarget + scopeFunction
   yarn tsx scripts/settlementGuard.ts allowance-tx <fund>   # setAllowance
   ```
   To send them as one Safe batch, merge their `transactions` arrays into a
   single file (same Safe, `meta.createdFromSafeAddress`). `policy-tx` never
   revokes other live permissions of the role, but it re-writes every function of
   the role from the repo: compare the live role (`check`, events or the roles
   app) with the repo before executing.
4. **Validate**:
   ```bash
   yarn check:types                       # only TODO_OPS errors may remain before ops fill values
   npx prettier --check <changed files>   # touched files only (CRLF checkouts: check LF content)
   yarn test clients/<fund>/mainnet/roles/<ROLE>
   ```
   On Windows the repo's `yarn test` cannot expand `${FORK_RPC:-…}`: start
   `anvil --silent --fork-url https://ethereum-rpc.publicnode.com` yourself and run
   `npx jest --runInBand clients/<fund>/mainnet/roles/<ROLE>`.
5. **Fork-test the batch** before proposing. The repo's Jest suites prove the
   permission shape but never consume budget (their inner call reverts, which
   rolls the consumption back), so test the real thing: on a fork, send the
   `.raw.json` calls as the impersonated **Manager Safe**, then, as the real bot
   member (`roles/<ROLE>/members.ts`):
   - a legit settle at the live price succeeds for every pinned asset and emits
     `ConsumeAllowance(processRequests-calls, 1, N − 1)`;
   - `min − 1` reverts `ConditionViolation` status 8 and `max + 1` status 9;
     exactly `min` and exactly `max` pass;
   - after the balance is spent, the next call reverts status 18; one period
     later it passes again.
6. **Open the PR** in the `permission-update-request` format (`| Field | Value |`
   table per fund/instance; what changed; validation), then review it with
   `permission-review`. Attach nothing that contains real numbers ops have not
   approved.
7. **After execution** run `check <fund>`: live policy guarded with the file's
   band, price position, allowance on-chain vs config, `UNSET` / exhausted (with
   next refill time). Merge the PR.

**Re-centring later**: steps 1, 3 (`policy-tx` only), 4–7. One `scopeFunction`;
no new `setAllowance`. **Budget only**: edit `callAllowance`, then
`allowance-tx`, 4–7.

### Alpha switch window (usd-alpha / eth-alpha)

In production the guard goes on the **new** v2.1.1 manager mods only (the
`manager_prod` instance files point at them); the old v2.1.0 mods stop being used once the manager-mod
switch (`enableModule(new)` / `disableModule(old)` on the Manager Safe) executes,
so they are not guarded. Ship the guard and the switch **in the same Manager Safe
batch**, guard calls first — never the switch alone, so the bot never settles
through an unguarded new mod. Caveat: a rollback that re-enables an old mod would
restore an unguarded settlement path — guard it first if that ever happens. The
Main Roles Modifier switch (via the Security Council) does not touch the
settlement role.

### Stage

`--instance manager_stage` works end to end for **usd-alpha** (guard + budget).
Its stage modifier is still a v2.1.0 proxy (not redeployed); the guard works the
same there, but it carries the v2.1.0 caveats of the redeploy work.
**eth-alpha stage is excluded**: on-chain it settles through an unscoped
`PROCESS_SUBSCRIPTIONS_AGENT` role, not the repo's `REQUESTS`, so its instance has
no `settlementGuard` and compiling it throws. Reconcile that modifier first.
The stage bot is a different member than prod (`members.ts` is shared; `yarn apply`
never sets members).

## Case B — a fund truly outside this repo (exception)

Only when the fund has no folder here. Read the role key, conditions and members
from the modifier's events first. Build the `processRequests` condition with
`zodiac-roles-sdk` — arrays `Pass`, asset `c.eq(asset)` (or `c.or` of the approved
assets), price `c.and(c.gte(min), c.lte(max))` — and append the
budget node to the root `Matches` by hand exactly as `withCallBudget` in
`helpers/settlementGuard.ts` does (`{ paramType: None, operator:
CallWithinAllowance, compValue: SETTLEMENT_GUARD_ALLOWANCE_KEY }`). Encode
`scopeFunction(roleKey, shares, 0xd6fd0c57, flattenCondition(condition), 0)`
with the Roles ABI, as `policy-tx` does (breadth-first flattening; the published
SDK does not export its encoder) — no `planApplyRole`, no indexer — and add the
`setAllowance`. Fork-test as in step 5. If a repo folder
for that fund exists but nobody applies from it, onboard it instead — a later
apply from a stale folder would drop the guard.

## Monitoring (tell ops)

- `ConditionViolation` from the bot: status **8** (below min), **9** (above max),
  **18** (budget spent), **5** / **7** (asset not pinned).
- `ConsumeAllowance` driving `processRequests-calls` to 0.
- Daily: `yarn tsx scripts/settlementGuard.ts check <fund>` (live policy still
  guarded, price-to-edge, budget).
- Any unannounced `ScopeFunction`, `AllowFunction`, `AllowTarget`,
  `RevokeFunction`, `RevokeTarget`, `SetAllowance`, `AssignRoles`,
  `SetUnwrapAdapter`, `OwnershipTransferred` or `EnabledModule` on the manager
  modifier.
- Any new operator on the shares contract: the guard only covers the bot's path
  through the manager modifier; another operator can call `processRequests`
  unguarded.

## What this does NOT cover

- A compromised Manager Safe (it can settle at any price, and change the guard).
- Honest settlement at a wrong NAV inside the band.
- Other operators of the shares contract, and funds whose Manager Safe settles
  directly with no bot role — there the Safe threshold is the control.

Interim until the `kpkShares` fix is audited and upgraded.
