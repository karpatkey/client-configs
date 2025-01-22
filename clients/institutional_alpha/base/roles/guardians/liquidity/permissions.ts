import { PermissionList } from "../../../../../../types"
import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, cbETH, morpho } from "../../../../../../eth-sdk/addresses_base"

export default [
  // Aave v3 - Withdraw USDC
  allow.base.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),

  // Morpho Blue - cbETH/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.oracleCbEthUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
