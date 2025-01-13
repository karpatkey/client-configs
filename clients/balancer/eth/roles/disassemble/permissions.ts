import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  GHO,
  OETH,
  osETH,
  sDAI,
  USDC,
  USDS,
  WBTC,
  WETH,
  wstETH,
  convex,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import {
  convexWithdraw,
  lidoUnstakeStEth,
  lidoUnwrapAndUnstakeWstEth,
} from "../../../../../helpers/exit_strategies"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave Safety Module - Unstake AAVE and GHO
  allow.mainnet.aaveV2.stkAave.redeem(c.avatar),
  allow.mainnet.aaveV2.stkAave.cooldown(),
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aave v3 Core Market - Withdraw DAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw osETH
  allow.mainnet.aaveV3.poolCoreV3.withdraw(osETH, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw sDAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDS
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDS, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw WBTC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(WBTC, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw wstETH
  allow.mainnet.aaveV3.poolCoreV3.withdraw(wstETH, undefined, c.avatar),
  // Aave v3 - Repay GHO
  ...allowErc20Approve([GHO], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(GHO, undefined, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Convex - ETH/OETH
  convexWithdraw(convex.cvxOethCrvRewarder),

  // Curve - ETH/OETH
  allow.mainnet.curve.oEthCrvPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.oEthCrvGauge["withdraw(uint256)"](),

  // Gyroscope - Unstaking GYD
  allow.mainnet.gyroscope.sGyd.redeem(undefined, c.avatar, c.avatar),

  // Lido
  lidoUnstakeStEth(),
  lidoUnwrapAndUnstakeWstEth(),

  // Origin - Redeem via ARM (Automated Redemption Manager)
  allowErc20Approve([OETH], [contracts.mainnet.origin.armOethWeth]),
  allow.mainnet.origin.armOethWeth[
    "swapExactTokensForTokens(address,address,uint256,uint256,address)"
  ](OETH, WETH, undefined, undefined, c.avatar),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.oEthVault.requestWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawals(),

  // Rocket Pool
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),

  // Sky - DSR (DAI Savings Rate)
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - SKY_USDS
  ...allowErc20Approve([USDS], [contracts.mainnet.spark.migrationActions]),
  allow.mainnet.spark.migrationActions.downgradeUSDSToDAI(c.avatar),
  allow.mainnet.spark.sUsds.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),

  // StakeWise v3 - Genesis Vault
  allow.mainnet.stakeWiseV3.genesis.burnOsToken(),
  allow.mainnet.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.mainnet.stakeWiseV3.genesis.claimExitedAssets(),

  // Uniswap v3 - WBTC + WETH
  allow.mainnet.uniswapV3.positionsNft.decreaseLiquidity(),
  allow.mainnet.uniswapV3.positionsNft.collect({
    recipient: c.avatar,
  }),
] satisfies PermissionList
