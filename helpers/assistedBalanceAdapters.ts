import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

// onchain-accounting assisted balance adapters (ADR 0030): owner-side recovery
// calls, made as the Safe (plain call). Every function is keyed on msg.sender,
// so it only touches the Safe's own cached coordinates:
// - evict: drop one of the Safe's entries (e.g. a position a keeper filed
//   in its name); can only under-report the Safe's own NAV, and submit
//   re-adds it (clearAccount, which wipes all entries at once, is not granted);
// - submit: re-add a position the Safe owns (reverts if not owned/live);
// - remove: drop an entry that is no longer live (reverts while live).

export const allowAssistedBalanceRecoveryMainnet = () =>
  [
    // ether.fi - Withdrawal queue adapter
    allow.mainnet.etherfi.assistedBalanceAdapter.evict(),
    allow.mainnet.etherfi.assistedBalanceAdapter.remove(),
    allow.mainnet.etherfi.assistedBalanceAdapter.submit(),

    // Nexus Mutual - Staking pools adapter
    allow.mainnet.nexus.assistedBalanceAdapter.evict(),
    allow.mainnet.nexus.assistedBalanceAdapter.remove(),
    allow.mainnet.nexus.assistedBalanceAdapter.submit(),

    // StakeWise v3 - Exit queue adapter
    allow.mainnet.stakeWiseV3.assistedBalanceAdapter.evict(),
    allow.mainnet.stakeWiseV3.assistedBalanceAdapter.remove(),
    allow.mainnet.stakeWiseV3.assistedBalanceAdapter.submit(),
  ] satisfies PermissionList

export const allowAssistedBalanceRecoveryGnosis = () =>
  [
    // StakeWise v3 - Exit queue adapter
    allow.gnosis.stakeWiseV3.assistedBalanceAdapter.evict(),
    allow.gnosis.stakeWiseV3.assistedBalanceAdapter.remove(),
    allow.gnosis.stakeWiseV3.assistedBalanceAdapter.submit(),
  ] satisfies PermissionList
