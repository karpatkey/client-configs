import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { PermissionList } from "../../../../../../types"
import {
  zeroAddress,
  AAVE,
  AURA,
  BAL,
  COMP,
  CRV,
  crvUSD,
  CVX,
  DAI,
  GHO,
  GYD,
  NOTE,
  sDAI,
  sUSDe,
  stkGHO,
  USDC,
  USDe,
  USDM,
  USDT,
  WBTC,
  wM,
  wstETH,
  balancer,
  morpho,
  pendle,
} from "../../../../../../eth-sdk/addresses"

export default [
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Compound v3 - Deposit USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Morpho Blue - wstETH/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.oracleWstEthUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
