import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { RPL, USDC, morpho } from "@/addresses/arb1"
import { PermissionList } from "@/types"

export default [
  // Unwrap ETH
  allow.arbitrumOne.weth.withdraw(),

  // Morpho Market - Withdraw USDC/RPL - id: 0xc7670063349ac19dfa324ead7bd7da2985ae931e1b09fb0e31b62c6486b730bd
  allow.arbitrumOne.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: RPL,
      oracle: morpho.oracleUsdcRpl,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

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
