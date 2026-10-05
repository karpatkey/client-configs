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
  (inclusive; integer string, 8-decimal fixed point — the unit of
  `getLastSettledPrice`).
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

### Trade-off (computed by `suggest` for the numbers ops propose)

| Ops input                                    | Worst case per subscribe+redeem cycle | Worst case per period                   | Real cap                                                 |
| -------------------------------------------- | ------------------------------------- | --------------------------------------- | -------------------------------------------------------- |
| band `[min, max]`, budget `N` calls / period | `max/min − 1`                         | `(max/min)^(N/2) − 1` (rounds compound) | idle cash an attacker can redeem from the Portfolio Safe |

Be honest with ops about what this does and doesn't bound:

- **Rounds compound inside the budget.** Each subscribe-low / redeem-high round
  multiplies the attacker's capital by up to `max/min`, so the per-period figure,
  not the per-cycle one, is the real exposure.
- **One call can approve many request ids**, so the budget caps the number of
  rounds, not the volume per round.
- **The binding cap is the cash on the Portfolio Safe** an attacker can redeem.
  Make _keeping idle cash minimal and funding redemptions just in time_ part of the
  control, not an afterthought.
- A **wider band** re-centres less often but leaks more per round; a **larger
  budget** tolerates settlement peaks but compounds more rounds. The budget must
  still exceed the real peak of settlement calls per period (see `suggest`'s
  history), or the bot stalls.

## Facts that never change

- **Allowance key**: `encodeBytes32String("processRequests-calls")`
  (`SETTLEMENT_GUARD_ALLOWANCE_KEY` in `helpers/settlementGuard.ts`). Fixed; ops
  never choose it.
- **`yarn apply` does not set allowance amounts.** The policy only references the
  key. Without `setAllowance` the budget is 0 and every bot call reverts with
  `CallAllowanceExceeded` (safe, but a stopped bot). Always ship **two calls**: the
  policy (`scopeFunction`) and the allowance (`setAllowance`).
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
  only then extend `settlementAssets` and re-check the band. `check` cross-checks
  the pin against `shares.getApprovedAssets()`.

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

## Case A — the fund is in this repo (default)

1. **Get the band from ops** (`--down` / `--up` in %, their choice):
   ```bash
   yarn tsx scripts/settlementGuard.ts suggest <fund> --down <X> --up <Y> [--instance manager_prod]
   ```
   One anchoring rule: min from the **lowest** approved-asset last settled price,
   max from the **highest**. It prints the last settlements (exact prices decoded
   from the bot's txs), the current band, a re-centring-ratchet warning when the
   anchor sits within 1% of a current edge, and the per-cycle / per-period worst
   case for the configured budget. `--write` writes `sharesPriceMin/Max` into the
   instance file.
2. **Set the budget** in the same `settlementGuard` block (ops choose
   `balance`, `maxRefill`, `refill`, `periodSeconds`):
   ```ts
   settlementGuard: {
     sharesPriceMin: "<from suggest>",
     sharesPriceMax: "<from suggest>",
     callAllowance: { balance: <ops>, maxRefill: <ops>, refill: <ops>, periodSeconds: <ops> },
   },
   ```
3. **Build the Manager Safe files** (local only, written to `./export/`):
   ```bash
   yarn tsx scripts/settlementGuard.ts policy-tx    <fund> --instance manager_prod   # scopeTarget + scopeFunction
   yarn tsx scripts/settlementGuard.ts allowance-tx <fund> --instance manager_prod   # setAllowance
   ```
   Both refuse a modifier not owned by the instance avatar. `allowance-tx` prints
   the current on-chain allowance next to the new one. `policy-tx` re-issues a
   harmless `scopeTarget` plus the full `scopeFunction`; it compiles and encodes
   offline (no roles app, no indexer). Each command writes its own file: to send
   them as one Safe batch, merge their `transactions` arrays into a single file
   (same Safe, `meta.createdFromSafeAddress`). Once every value is set, delete the
   now-unused `TODO_OPS` import from the instance (`--write` does it when no
   placeholder is left).
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
   rolls the consumption back), so test the real thing: on a fork, execute the
   batch as the impersonated **Manager Safe**, then, as the real bot member:
   - a legit settle at the live price succeeds for every pinned asset and emits
     `ConsumeAllowance(processRequests-calls, 1, N − 1)`;
   - `min − 1` reverts `ConditionViolation` status 8 and `max + 1` status 9;
   - after `N` successful calls in one period, call `N + 1` reverts status 18.
6. **Open the PR** in the `permission-update-request` format (`| Field | Value |`
   table per fund/instance; what changed; validation), then review it with
   `permission-review`. Attach nothing that contains real numbers ops have not
   approved.
7. **After execution** run `check <fund>`: band position vs live price,
   allowance on-chain vs config, `UNSET` / exhausted (with next refill time).

**Re-centring later**: steps 1, 3 (`policy-tx` only), 4–7. One `scopeFunction`;
no new `setAllowance`.

### Alpha switch window (usd-alpha / eth-alpha)

The guard goes on the **new** v2.1.1 manager mods only (`manager_prod` on this
branch); the old v2.1.0 mods stop being used once the manager-mod switch
(`enableModule(new)` / `disableModule(old)` on the Manager Safe) executes, so
they are not guarded. Ship the guard and the switch in the **same Manager Safe
batch** (guard calls first) or run the guard before the switch, so the bot never
settles through an unguarded new mod. Caveat: a rollback that re-enables an old
mod would restore an unguarded settlement path — guard it first if that ever
happens. The Main Roles Modifier switch (via the Security Council) does not touch
the settlement role.

### Stage

`--instance manager_stage` works end to end for **usd-alpha** (guard + budget).
**eth-alpha stage is excluded**: on-chain it settles through an unscoped
`PROCESS_SUBSCRIPTIONS_AGENT` role, not the repo's `REQUESTS`, so its instance has
no `settlementGuard` and compiling it throws. Reconcile that modifier first.
The stage bot is a different member than prod (`members.ts` is shared; `yarn apply`
never sets members).

## Case B — a fund truly outside this repo (exception)

Only when the fund has no folder here. Read the role key, conditions and members
from the modifier's events first; build `scopeFunction(<roleKey>, <shares>,
0xd6fd0c57, <conditions>, 0)` with arrays `Pass`, asset `EqualTo` (or `Or` of the
approved assets), price `And(GreaterThan(min − 1), LessThan(max + 1))` and
`CallWithinAllowance("processRequests-calls")`, using `zodiac-roles-sdk`
(`c.and(c.gte(min), c.lte(max))`, `{ callWithinAllowance: key }`) and
`planApplyRole` with an explicit `current` (no indexer). Add the `setAllowance`.
Fork-test as in step 5. If a repo folder for that fund exists but nobody applies
from it, onboard it instead — a later apply from a stale folder would drop the
guard.

## Monitoring (tell ops)

- `ConditionViolation` from the bot: status **8** (below min), **9** (above max),
  **18** (budget spent).
- `ConsumeAllowance` driving `processRequests-calls` to 0.
- Price-to-edge daily: `yarn tsx scripts/settlementGuard.ts check <fund>`.
- Any unannounced `ScopeFunction`, `SetAllowance`, `AssignRoles` or
  `EnabledModule` on the manager modifier.

## What this does NOT cover

- A compromised Manager Safe (it can settle at any price, and change the guard).
- Honest settlement at a wrong NAV.
- Funds whose Manager Safe settles directly with no bot role — there the Safe
  threshold is the control.

Interim until the `kpkShares` fix is audited and upgraded.
