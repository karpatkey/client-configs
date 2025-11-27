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
    targetAddress: morpho.kpkUsdc,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdc,
  }
] satisfies PermissionList
