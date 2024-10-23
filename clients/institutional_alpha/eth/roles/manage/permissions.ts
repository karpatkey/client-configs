import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { USDT, WBTC, morpho } from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Morpho Blue - WBTC/USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.morpho.morpho_blue]),
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDT,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDT,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

  // Notional v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.notional_v3.nProxy]),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 4, // DepositUnderlyingAndMintNToken
      currencyId: 8, // USDT
    })
  ),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 5, // RedeemNToken
      currencyId: 2, // USDT
    })
  ),
  allow.mainnet.notional_v3.nProxy.nTokenClaimIncentives(),
] satisfies PermissionList
