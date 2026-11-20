import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho } from "@/addresses/base"
import { PermissionList } from "@/types"

export default [
  // Morpho Vault - kpk USDC Yield v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
] satisfies PermissionList
