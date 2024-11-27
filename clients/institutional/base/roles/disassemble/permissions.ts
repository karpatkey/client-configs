import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { cbETH, USDC, morpho } from "../../../../../eth-sdk/addresses_base"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v3 - Withdraw USDC
  allow.base.aaveV3.lendingPoolV3.withdraw(USDC, undefined, c.avatar),

  // Morpho Blue - Withdraw cbETH/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.Oracle_cbETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
