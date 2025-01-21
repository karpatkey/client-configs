import { PermissionList } from "../../../../../../types"
import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/base"
import { USDC, cbETH, morpho } from "../../../../../../eth-sdk/addresses_base"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
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
