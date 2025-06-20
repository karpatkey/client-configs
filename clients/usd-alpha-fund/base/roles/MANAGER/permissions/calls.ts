import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, cbETH, morpho } from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Morpho Blue - cbETH/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
  allow.mainnet.morpho.morphoBlue.supply(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.oracleCbEthUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
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

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.base.navCalculator.bridgeStart(),

  // Base -> Mainnet
  // USDC (Base) -> USDC (Mainnet) - HOP
  ...allowErc20Approve([USDC], [contracts.base.l2HopCctp]),
  allow.base.l2HopCctp.send(
    1, // Mainnet
    c.avatar
  ),
] satisfies PermissionList
