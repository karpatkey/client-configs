import { allow } from "zodiac-roles-sdk/kit"
import { allowAssistedBalanceRecoveryGnosis } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),

  // onchain-accounting - Assisted balance adapters (ADR 0030): Safe-side
  // evict / submit / remove of its own entries
  ...allowAssistedBalanceRecoveryGnosis(),
] satisfies PermissionList
