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
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 Core Market - Deposit crvUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["crvUSD"] }),
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit sUSDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sUSDe"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),

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
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdt,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
