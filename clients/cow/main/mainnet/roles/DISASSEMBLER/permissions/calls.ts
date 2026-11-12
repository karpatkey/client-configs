import { allowAssistedBalanceRecoveryMainnet } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // onchain-accounting - Assisted balance adapters (ADR 0030): Safe-side
  // evict / submit / remove of its own entries
  ...allowAssistedBalanceRecoveryMainnet(),
] satisfies PermissionList
