---
name: permission-review
description: >
  Security-review a Pull Request that adds or changes a permission policy in
  client-configs. Pulls the real contract code (Etherscan verified source + the
  protocol's official GitHub), analyses every scoped function, simulates the
  scoped transactions against the user's specific setup (anvil fork or Tenderly)
  to confirm they can be called and that out-of-scope variants are blocked, and
  reports security findings and scoping recommendations. Use whenever someone
  asks to review / audit / security-check a policy PR, a new role, or new scoped
  functions — e.g. "review PR #214 for security", "audit this Kelp scoping",
  "is this calls.ts safe?".
---

# Permission Review

This skill reviews a permission-policy PR for **security**, focused on whether the
scoped functions are correctly and minimally scoped, and whether they actually
behave as the policy assumes. It complements `permission-update-request` (which _builds_
the policy); this one _audits_ it.

The deliverable is a written review: per-function analysis, simulation results, and
concrete scoping recommendations with severity.

> 🛑 **Ground every claim in real artifacts — never assume.** Base the review on
> the actual diff, the verified on-chain contract code, the protocol's official
> source/docs/audits, and real simulation output. If you can't obtain something
> needed to judge safety (a verified ABI, the deployed source, the user's setup
> addresses), **ask the user** rather than guessing. Do not approve scoping you
> could not verify — say so explicitly.

---

## 0. Gather inputs

Ask the user for whatever isn't already provided:

**The change under review**

- PR number / branch / diff (e.g. `gh pr checkout 214`), or the specific files.
- Client / network / role / instance affected.

**The specific setup to simulate against** (so the review reflects reality, not a generic fork)

- Target **network** + an **RPC URL / archive node** for it (for `FORK_RPC`).
- The **Roles Modifier** address, the **Avatar Safe**, and the **member** (the account/Safe that holds the role) — when reviewing against the live deployment.
- A **block number** to fork at, if reproducibility matters.
- Preferred simulation backend: **anvil fork** (default, free, local) or **Tenderly** (shareable, good for stakeholders).

**Protocol source material** (essential for any new/hand-scoped protocol — see §2)

- Contract addresses on the target network.
- Etherscan/explorer links (verified source).
- Official **GitHub** repo (ideally the deployed version/commit).
- **ABIs**, **docs**, and **audit reports**.
- Sample transactions (Etherscan/Tenderly) of the action executed through a Safe.

---

## 1. Read the diff and enumerate the scoped surface

Check out the branch and read the changed permission files:

```bash
gh pr checkout <number>        # or: git fetch && git checkout <branch>
git diff main... -- 'clients/**/permissions/*.ts'
```

For the changed role, open `_actions.ts` and `calls.ts` and build an explicit
inventory of **every permission entry** the PR adds/modifies, capturing for each:

- Target **contract** + **function selector/signature**.
- Every **scoping condition** (`c.avatar`, `c.eq`, `c.or`, allowlists, allowances, `send`/`delegatecall` flags).
- Which arguments are **pinned** vs. **left open**.
- Whether it's a **DeFi-Kit action** (`_actions.ts`, pre-audited) or **typed-preset / ad-hoc** (`calls.ts`, hand-scoped — higher scrutiny).

DeFi-Kit actions are pre-audited; concentrate effort on the **ad-hoc `calls.ts`
entries** and anything granting approvals, transfers, bridging, arbitrary
calls/delegatecalls, or unbounded recipients.

> 🧹 **PR scope hygiene.** Confirm the PR touches **only** permission policy files
> (and any intended address/contract additions). Flag any unrelated files that
> crept in — dependency manifests, lockfiles, build/config or local tooling
> scripts — so they're removed before merge (`git diff --name-only main...`).

---

## 2. Pull and analyse the real contract code

For each contract touched by the scoped functions — **especially new protocols
not in DeFi-Kit** — get the ground truth and analyse it:

1. **Verified source from the explorer.** Fetch the verified contract source from
   Etherscan/the chain explorer (WebFetch the `#code` page, or the explorer API
   `getsourcecode`/`getabi`). Confirm the address is the canonical deployment.
2. **Official GitHub.** Cross-reference the explorer source against the protocol's
   official repo at the deployed version/commit. Note any divergence (proxies,
   upgradeability, libraries).
3. **ABIs & audits.** Use the verified ABI for simulation; read the audit reports
   for known risks and trust assumptions.

Then, **per scoped function**, analyse:

- What it does and each parameter's meaning.
- **Token flows** — what it pulls, mints, burns, or sends, and to whom.
- **Recipient control** — can output/funds be directed to an arbitrary address? Is the recipient pinned to the Avatar Safe?
- **Approvals** — does it set/rely on allowances? Are spenders constrained?
- **Access control & callable-ness** — can the role's member actually call it (modifiers, pause, whitelist)?
- **Upgradeability / proxy** — could the implementation change underneath the scope?
- **Reentrancy / external calls / delegatecall** — anything that breaks the "permission firewall" assumption.

---

## 3. Assess the scoping for security

Judge each entry against the principle of **least privilege**. Common findings to
check for explicitly:

- **Unpinned recipient** — withdraw/transfer/redeem whose destination isn't forced to `c.avatar`, allowing exfiltration to arbitrary addresses.
- **Over-broad token/spender allowlists** — approvals to non-essential spenders, or `c.or(...)` lists wider than the strategy needs.
- **Unbounded approvals / no allowance** — large or infinite approvals where an Allowance (cap + timeframe) would be safer.
- **Arbitrary call surface** — `multicall`, `execute`, `aggregate`, generic `call`/`delegatecall`, or routers that can re-enter and reach anything.
- **Wrong direction / asset** — bridge/swap source vs. destination token or chain not constrained as intended.
- **Missing constraints on amounts, pools, markets, or `targets`.**
- **Proxy/upgrade risk** scoped without acknowledgement.
- **Mismatch between the comment and the actual scope** in the code.

For each finding, record: location (`file:line`), severity (Critical / High /
Medium / Low / Info), why it's a risk, and a concrete fix.

---

## 4. Simulate against the user's setup

Simulation proves the scoped functions **can be called** (allowed) and that
out-of-scope variants are **blocked**. Use the repo's existing anvil+jest harness;
fall back to Tenderly when a shareable artifact is wanted.

### Option A — anvil fork via the repo test harness (default)

The repo already simulates policies on an anvil fork. Mirror an existing
`permissions.test.ts` (e.g. `clients/ens-dao/mainnet/roles/MANAGER/permissions.test.ts`):

- `applyPermissions({ allowedCalls, allowedActions }, parameters)` applies the PR's policy to a fresh test Roles Modifier on the fork.
- `kit.asMember.<contract>.<fn>(...)` executes the call **through the role** as the member.
- Custom matchers assert outcomes: `await expect(...).not.toRevert()` / `.toBeAllowed()` for in-scope calls, and `.toBeForbidden()` for out-of-scope variants.

Write a focused test that, for each scoped entry:

1. Sets up prerequisite state (acquire tokens, approvals) using helpers like `wrapEth`.
2. Calls the **allowed** action with in-scope arguments → expect **not forbidden / not reverted**.
3. Calls a **deliberately out-of-scope** variant (e.g. recipient ≠ avatar, token not in the allowlist) → expect **`toBeForbidden()`**.

Run it against the **target network** by forking the right chain:

```bash
# Fork the network the policy targets (default fork RPC is mainnet)
FORK_RPC=<archive-rpc-url-for-target-chain> yarn test clients/<client>[/<account>]/<network>/roles/<ROLE>/permissions.test.ts
```

To reproduce the **user's live deployment** exactly, fork at their block and point
the harness/anvil at their `rolesMod` / `avatar` / `member` (impersonate the member
with `anvil_impersonateAccount` + `anvil_setBalance`, as `test/wallets.ts` does),
then execute the scoped calls through the real Roles Modifier.

### Option B — Tenderly

When a shareable simulation is preferred, export the update payload and simulate it
on Tenderly against the user's setup:

```bash
yarn apply:export <client> <network>(/<instance>) <ROLE>   # writes payload JSON to ./export
```

Use Tenderly (fork or simulation API) on the target network at the chosen block to
run the role's `execTransactionWithRole`-style calls for each scoped function, and
capture the pass/fail + traces. Link the Tenderly simulations in the report.

> Record exactly what was simulated (network, block, addresses, backend) and the
> outcome of every case. If a scoped call **can't** be executed (reverts for a
> reason unrelated to permissions, or the member can't call it at all), flag it —
> a permission that can never succeed is itself a defect.

---

## 5. Report

Produce a structured review:

1. **Summary** — what the PR changes, overall risk verdict (e.g. _safe to merge_, _changes requested_, _needs Ops Engineering sign-off_).
2. **Scoped-surface inventory** — the table from §1.
3. **Contract analysis** — per-contract notes from §2, with the source/audit links used.
4. **Findings** — each with `file:line`, severity, risk, and recommended fix (from §3).
5. **Simulation results** — what was run (network, block, addresses, backend) and the allowed/forbidden outcome of each case, with Tenderly/test links.
6. **Recommendations** — concrete scoping tightenings (pin recipients to `c.avatar`, narrow allowlists, add allowances, drop arbitrary-call surfaces, etc.).

When asked to post the review on the PR, use `gh pr review` / `gh pr comment` (and
inline comments for specific lines). Do **not** approve a PR whose scoping you could
not verify or whose simulation you could not run — state what's missing instead.

---

## Quick reference

| Thing                        | Where / command                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Check out the PR             | `gh pr checkout <number>`                                                              |
| Diff of permission files     | `git diff main... -- 'clients/**/permissions/*.ts'`                                    |
| Apply harness                | `applyPermissions(...)` in `test/helpers.ts`                                           |
| Execute through role         | `kit.asMember.<contract>.<fn>(...)` (`test/kit.ts`)                                    |
| Matchers                     | `toRevert` · `toBeAllowed` · `toBeForbidden` (`test/setup-after-env.ts`)               |
| Test wallets / impersonation | `test/wallets.ts` (`anvil_impersonateAccount`, `anvil_setBalance`)                     |
| Run a single policy test     | `FORK_RPC=<rpc> yarn test clients/<client>[/<account>]/<network>/roles/<ROLE>/permissions.test.ts` |
| Fork RPC selection           | `FORK_RPC` env (defaults to mainnet)                                                   |
| Export payload for Tenderly  | `yarn apply:export <client> <network>(/<instance>) <ROLE>`                             |
| Compile + visual diff        | `yarn apply <client> <network>(/<instance>) <ROLE>`                                    |
| Verified source              | explorer `#code` page / API `getsourcecode` · official GitHub                          |
| Allowances reference         | https://docs.roles.gnosisguild.org/general/allowances                                  |
