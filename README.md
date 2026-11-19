# client-configs

This projects hosts roles permissions and other configurations for clients

## Pre-requisites

- node v21 (other versions might work)
- yarn v1 (classic)
- anvil v0.2 (install through [foundryup](https://book.getfoundry.sh/getting-started/installation#using-foundryup))

## Setup

- `yarn install`
- `yarn setup`

## Commands

##### Run tests:

`yarn test`

##### Apply permission updates to a role

To apply permission updates to a role run the following command:

`yarn apply <client> <account>(/<instance>) <role>`

Possible values:

- **client:** `balancer-dao`, `ens-dao`, `gnosis-ltd`, ...
- **account:** `mainnet`, `gno`
- **instance:** `main`, `test`, ... (defaults to `main`)
- **role:** `MANAGER`, `DISASSEMBLER`, ...

Examples:

- `yarn apply gnosis-dao mainnet MANAGER`
- `yarn apply balancer-dao mainnet/test MANAGER`

This will take you to the Zodiac Roles app for a visual overview of the updates.
From there you can download the update transaction payload.

For getting the update transaction payload directly, without depending on the Roles app, run the following command:

`yarn apply:export <client> <account>(/<instance>) <role>`

This will write a JSON file to the ./export folder. This file can be uploaded to the Safe Transaction Builder app for execution.

## OIV settlement guard

Interim fix ("S1") for the OIV funds' `kpkShares.processRequests`: the settlement bot's permission (`REQUESTS` on usd-/eth-alpha, `APPROVER` on xaut-/wbtc-carry, on the fund's manager Roles Modifier) carries an inclusive **price band** on `sharesPriceInAsset` and a **call budget** (`CallWithinAllowance`, key `processRequests-calls`). Full procedure: `.claude/skills/oiv-settlement-guard/SKILL.md`.

- **Where the numbers live:** `clients/<fund>/mainnet/instances/manager_prod.ts` (and `manager_stage.ts`) → `settlementGuard: { sharesPriceMin, sharesPriceMax, callAllowance: { balance, maxRefill, refill, periodSeconds } }`. Ops choose every value; the repo ships `TODO_OPS` placeholders that fail `yarn check:types` and throw when compiled.
- **Two calls, always:** the policy (`scopeFunction`) and the allowance (`setAllowance`). `yarn apply` never sets allowance amounts — without `setAllowance` every bot call reverts. In one Safe batch order doesn't matter; as separate transactions run `setAllowance` first.
- **Tooling (local only; writes a Safe Transaction Builder file plus a `.raw.json` with the calldata to `./export/`; never POSTs, never sends a transaction):**
  - `yarn tsx scripts/settlementGuard.ts suggest <fund> --down <pct> --up <pct> [--anchorPrice <int>] [--write]`
  - `yarn tsx scripts/settlementGuard.ts policy-tx <fund>` / `allowance-tx <fund>`
  - `yarn tsx scripts/settlementGuard.ts check <fund>` (reads the live policy from the modifier's events)
  - every command takes `--instance` (default `manager_prod`); `--help` lists the options.
  - set `ETHERSCAN_API_KEY` in the environment for the log lookups (`suggest` history, `check` live policy); without it they use Blockscout's keyless API (about 10 calls per ~10 minutes). Never commit the key.
- **Re-centring:** a new band is one `scopeFunction` (`suggest` → `policy-tx`); no new `setAllowance`.
- **The repo follows the chain:** every band or budget executed on-chain lands in the repo as a PR (the instance file). Building the role from a ref without it would silently restore the old band.
- **Monitoring:** bot `ConditionViolation` status 8 / 9 (below / above the band), 18 (budget spent), 5 / 7 (asset not pinned); the allowance reaching 0; the price nearing an edge (`check`, daily); any unannounced `ScopeFunction` / `AllowFunction` / `AllowTarget` / `RevokeFunction` / `RevokeTarget` / `SetAllowance` / `AssignRoles` / `SetUnwrapAdapter` / `OwnershipTransferred` / `EnabledModule` on the manager modifier; any new operator on the shares.
