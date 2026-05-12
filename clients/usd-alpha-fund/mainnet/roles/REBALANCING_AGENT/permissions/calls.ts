import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, morpho } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Morpho Vault - kpk USDC Yield v2 (not yet registered in defi-kit)
  allowErc20Approve([USDC], [morpho.kpkUsdcYieldV2 as `0x${string}`]),
  {
    ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.mint(undefined, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
] satisfies PermissionList
