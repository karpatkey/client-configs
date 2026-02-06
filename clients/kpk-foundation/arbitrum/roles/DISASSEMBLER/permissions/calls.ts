import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho } from "@/addresses/arb1"
import { PermissionList } from "@/types"

export default [
  // Unwrap ETH
  allow.arbitrumOne.weth.withdraw(),

  // Morpho Vault - kpk USDC Yield v1.1
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV1,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV1,
  },
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
