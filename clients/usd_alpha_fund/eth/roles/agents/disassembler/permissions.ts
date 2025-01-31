import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../../types"
import {
  crvUSD,
  DAI,
  sDAI,
  sUSDe,
  USDC,
  USDe,
  USDT,
  WBTC,
  wstETH,
  morpho,
  USDS,
} from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Withdraw crvUSD
  allow.mainnet.aaveV3.poolCoreV3.withdraw(crvUSD, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw DAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw sDAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw sUSDe
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sUSDe, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDe
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDe, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDS
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDS, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDT
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDT, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
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
