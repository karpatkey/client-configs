import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, cbETH, cbBTC, morpho } from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { parameters } from "../../../instances/main"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Morpho Blue - cbBTC/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
  allow.mainnet.morpho.morphoBlue.supply(
    {
      loanToken: USDC,
      collateralToken: cbBTC,
      oracle: morpho.oracleCbBtcUsdc,
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
      collateralToken: cbBTC,
      oracle: morpho.oracleCbBtcUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

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
   * Bridges
   *********************************************/

  // USDC (Base) -> USDC (Mainnet) - stargate
  ...allowErc20Approve([USDC], [contracts.base.stargate.poolUsdc]),
  allow.base.stargate.poolUsdc.send(
    {
      dstEid: "30101", // Mainnet chain ID
      to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      extraOptions: "0x",
      composeMsg: "0x",
      oftCmd: "0x",
    },
    undefined,
    c.avatar,
    {
      send: true,
    }
  ),
] satisfies PermissionList
