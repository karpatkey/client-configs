import { allow } from "zodiac-roles-sdk/kit"
import { AURA } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../../types"

export default [
  allowErc20Approve([AURA], [contracts.mainnet.aura.claimZapV3]),
  allow.mainnet.aura.claimZapV3.claimRewards(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ),
  allow.mainnet.aura.vlAura.processExpiredLocks(undefined),
] satisfies PermissionList
