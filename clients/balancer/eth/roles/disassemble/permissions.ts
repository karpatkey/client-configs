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
  convex__withdraw,
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v3 - Withdraw DAI
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 - Withdraw osETH
  allow.mainnet.aave_v3.pool_v3.withdraw(osETH, undefined, c.avatar),
  // Aave v3 - Withdraw sDAI
  allow.mainnet.aave_v3.pool_v3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Withdraw USDS
  allow.mainnet.aave_v3.pool_v3.withdraw(USDS, undefined, c.avatar),
  // Aave v3 - Withdraw WBTC
  allow.mainnet.aave_v3.pool_v3.withdraw(WBTC, undefined, c.avatar),
  // Aave v3 - Withdraw wstETH
  allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),
  // Aave v3 - Repay GHO
  ...allowErc20Approve([GHO], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(GHO, undefined, undefined, c.avatar),

  // Compound v3 - USDC
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Convex - ETH/OETH
  convex__withdraw(convex.OETHCRV_f_rewarder),

  // Curve - ETH/OETH
  allow.mainnet.curve.OETHCRV_f_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.OETHCRV_f_pool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.OETHCRV_f_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.OETHCRV_f_gauge["withdraw(uint256)"](),

  // Gyroscope - Unstaking GYD
  allow.mainnet.gyroscope.sGYD.redeem(undefined, c.avatar, c.avatar),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Maker - DSR (DAI Savings Rate)
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Origin - Redeem via ARM (Automated Redemption Manager)
  allowErc20Approve([OETH], [contracts.mainnet.origin.ARM_OETH_WETH]),
  allow.mainnet.origin.ARM_OETH_WETH[
    "swapExactTokensForTokens(address,address,uint256,uint256,address)"
  ](OETH, WETH, undefined, undefined, c.avatar),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.OETH_Vault.requestWithdrawal(),
  allow.mainnet.origin.OETH_Vault.claimWithdrawal(),
  allow.mainnet.origin.OETH_Vault.claimWithdrawals(),

  // Spark - DSR/sDAI
  allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),
  // Spark - SKY_USDS
  allow.mainnet.spark.sUSDS.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sUSDS.withdraw(undefined, c.avatar, c.avatar),

  // StakeWise v3 - Genesis Vault
  allow.mainnet.stakewise_v3.genesis.burnOsToken(),
  allow.mainnet.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.mainnet.stakewise_v3.genesis.claimExitedAssets(),

  // Uniswap v3 - WBTC + WETH
  allow.mainnet.uniswap_v3.positions_nft.decreaseLiquidity(),
  allow.mainnet.uniswap_v3.positions_nft.collect({
    recipient: c.avatar,
  }),
] satisfies PermissionList
