import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

// onchain-accounting assisted balance adapters (ADR 0030), MAINNET only:
// owner-side recovery calls, made as the Safe (plain call), each keyed on
// msg.sender so they only touch the Safe's own cached entries:
// - evict: drop one of the Safe's entries, live or not (e.g. a position a
//   keeper filed in its name); lowers the Safe's reported NAV until the entry
//   is re-submitted (clearAccount, which wipes all entries at once, is not
//   granted, but several evicts can be batched);
// - submit: re-add a position; reverts unless the Safe owns it (StakeWise:
//   unless it is still owed);
// - remove: drop an entry the adapter reads as no longer owed (StakeWise
//   treats a failed vault read as nothing owed).
// Grant each adapter only to policies that use its protocol, inside that
// protocol's section.

const recovery = (adapter: {
  evict: () => PermissionList[number]
  remove: () => PermissionList[number]
  submit: () => PermissionList[number]
}) =>
  [adapter.evict(), adapter.remove(), adapter.submit()] satisfies PermissionList

// ether.fi - Withdrawal queue adapter
export const allowEtherfiAssistedBalanceRecoveryMainnet = () =>
  recovery(allow.mainnet.etherfi.assistedBalanceAdapter)

// Nexus Mutual - Staking pools adapter
export const allowNexusAssistedBalanceRecoveryMainnet = () =>
  recovery(allow.mainnet.nexus.assistedBalanceAdapter)

// StakeWise v3 - Exit queue adapter
export const allowStakeWiseV3AssistedBalanceRecoveryMainnet = () =>
  recovery(allow.mainnet.stakeWiseV3.assistedBalanceAdapter)
