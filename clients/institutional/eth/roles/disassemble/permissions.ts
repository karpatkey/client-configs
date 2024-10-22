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
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 - Withdraw sDAI
  allow.mainnet.aave_v3.pool_v3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Repay DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(DAI, undefined, undefined, c.avatar),
  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

  // Compound v3 - USDC
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Maker - Withdraw DSR (DAI Savings Rate)
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Morpho Blue - Withdraw wstETH/USDC
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - Withdraw WBTC/USDC
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    c.avatar
  ),

  // Spark - Withdraw DSR/sDAI
  allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),
  // Spark - Withdraw sDAI
  allow.mainnet.spark.sparkLendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  // Spark - Repay DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.spark.sparkLendingPoolV3]),
  allow.mainnet.spark.sparkLendingPoolV3.repay(
    DAI,
    undefined,
    undefined,
    c.avatar
  ),
  // Spark - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.spark.sparkLendingPoolV3]),
  allow.mainnet.spark.sparkLendingPoolV3.repay(
    USDC,
    undefined,
    undefined,
    c.avatar
  ),
] satisfies PermissionList
