import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  sDAI,
  USDC,
  WBTC,
  wstETH,
  morpho,
} from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"

export default [
  // Aave v3 - Withdraw DAI
  allow.mainnet.aaveV3.lendingPoolV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 - Withdraw sDAI
  allow.mainnet.aaveV3.lendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.mainnet.aaveV3.lendingPoolV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Repay DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.aaveV3.lendingPoolV3]),
  allow.mainnet.aaveV3.lendingPoolV3.repay(DAI, undefined, undefined, c.avatar),
  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aaveV3.lendingPoolV3]),
  allow.mainnet.aaveV3.lendingPoolV3.repay(
    USDC,
    undefined,
    undefined,
    c.avatar
  ),

  // Compound v3 - USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Maker - Withdraw DSR (DAI Savings Rate)
  allow.mainnet.maker.dsrManager.exit(c.avatar),
  allow.mainnet.maker.dsrManager.exitAll(c.avatar),

  // Morpho Blue - Withdraw wstETH/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - Withdraw WBTC/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

  // Spark - Withdraw DSR/sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - Withdraw sDAI
  allow.mainnet.spark.lendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  // Spark - Repay DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.spark.lendingPoolV3]),
  allow.mainnet.spark.lendingPoolV3.repay(DAI, undefined, undefined, c.avatar),
  // Spark - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.spark.lendingPoolV3]),
  allow.mainnet.spark.lendingPoolV3.repay(USDC, undefined, undefined, c.avatar),
] satisfies PermissionList
