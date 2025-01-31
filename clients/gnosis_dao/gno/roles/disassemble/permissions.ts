import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  aura,
  balancer,
  EURe,
  GNO,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import {
  balancerUnstakeWithdraw,
  balancerWithdraw,
} from "@/exit_strategies/balancer"
import { Chain, PermissionList } from "../../../../../types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"

export default [
  // Unwrap XDAI
  allow.gnosis.wxdai["withdraw"](),

  // Aave v3 - Withdraw XDAI
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.aaveV3.poolV3,
    undefined,
    c.avatar
  ),
  // Aave v3 - Withdraw WXDAI
  allow.gnosis.aaveV3.poolV3.withdraw(WXDAI, undefined, c.avatar),
  // Aave v3 - Withdraw wstETH
  allow.gnosis.aaveV3.poolV3.withdraw(wstETH, undefined, c.avatar),
  // Aave v3 - Withdraw WETH
  allow.gnosis.aaveV3.poolV3.withdraw(WETH, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.gnosis.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Withdraw EURe
  allow.gnosis.aaveV3.poolV3.withdraw(EURe, undefined, c.avatar),
  // Aave v3 - Withdraw GNO
  allow.gnosis.aaveV3.poolV3.withdraw(GNO, undefined, c.avatar),
  // Aave v3 - Withdraw USDC.e
  allow.gnosis.aaveV3.poolV3.withdraw(USDCe, undefined, c.avatar),

  // Aura - WETH/wstETH
  auraWithdrawBalancer(aura.auraWethWstEthRewarder, balancer.wethWstEthPid),
  // Aura - EURe/sDAI
  auraWithdrawBalancer(aura.auraEureSdaiRewarder, balancer.eureSdaiPid),
  // Aura - Gyroscope ECLP rETH/WETH
  auraWithdrawBalancer(
    aura.auraRethWethRewarder,
    balancer.eclpRethWethPid,
    false
  ),

  // Azuro - XDAI LP
  allow.gnosis.azuro.lpAzrXdai.withdrawLiquidity(),

  // Balancer - wstETH/GNO
  balancerUnstakeWithdraw(Chain.gno, balancer.b50wstEth50GnoGauge),
  // Balancer - sDAI/wstETH
  balancerUnstakeWithdraw(Chain.gno, balancer.b50Sdai50WstEthGauge),
  // Balancer - USDC.e/USDT/sDAI
  balancerUnstakeWithdraw(Chain.gno, balancer.sBal3NewGauge),
  // Balancer - WETH/wstETH
  balancerUnstakeWithdraw(Chain.gno, balancer.bbWethWstEthGauge),
  // Balancer - rETH/WETH
  balancerUnstakeWithdraw(Chain.gno, balancer.eclpRethWethGauge, false),
  // Balancer - osGNO/GNO
  balancerUnstakeWithdraw(Chain.gno, balancer.osGnoGnoGauge),
  // Balancer - WBTC/WETH
  balancerWithdraw(balancer.b50Wbtc50WethPid, false),
  // Balancer - Gyroscope ECLP wstETH/WETH
  balancerUnstakeWithdraw(Chain.gno, balancer.eclpWstEthWethGauge),
  // Balancer - wstETH/BAL/AURA
  balancerUnstakeWithdraw(Chain.gno, balancer.b50WstEth25Bal25AuraGauge),
  // Balancer - wstETH/COW
  balancerUnstakeWithdraw(Chain.gno, balancer.b50WstEth50CowGauge, false),
  // Balancer - COW/GNO
  balancerUnstakeWithdraw(Chain.gno, balancer.b50Cow50GnoGauge, false),
  // Balancer - stEUR/EURe
  balancerUnstakeWithdraw(Chain.gno, balancer.stEurEureGauge),
  // Balancer - GIV/GNO
  balancerWithdraw(balancer.b50Giv50GnoPid, false),
  // Balancer - WXDAI/GNO
  balancerWithdraw(balancer.wxdaiGnoPid, false),
  // Balancer - EURe/sDAI
  balancerUnstakeWithdraw(Chain.gno, balancer.eureSdaiGauge),
  // Balancer - BCoW AMM WETH/GNO (Staking not available)
  allow.gnosis.balancer.bCowAmm50Weth50Gno.exitPool(),
  // Balancer - BCoW AMM wstETH/sDAI (Staking not available)
  allow.gnosis.balancer.bCowAmm50wstEth50sDai.exitPool(),
  // Balancer - BCoW AMM GNO/OLAS (Staking not available)
  allow.gnosis.balancer.bCowAmm50Gno50Olas.exitPool(),
  // Balancer - BCoW AMM GNO/COW (Staking not available)
  allow.gnosis.balancer.bCowAmm50Gno50Cow.exitPool(),

  // Curve - EURe/EURC.e
  allow.gnosis.curve.eureEurc["remove_liquidity(uint256,uint256[])"](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  // Curve - EURe/x3CRV
  allow.gnosis.curve.crvEureUsdPool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEureUsdPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  allow.gnosis.curve.crvEureUsdZap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEureUsdZap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  allow.gnosis.curve.crvEureUsdGauge["withdraw(uint256)"](),

  // Hyperdrive - wstETH
  allow.gnosis.hyperdrive.wstEthLp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),
  // Hyperdrive - WXDAI/sDAI
  allow.gnosis.hyperdrive.wxdaiSdaiLp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),

  // Spark - DSR_sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  // Spark - Withdraw GNO
  allow.gnosis.spark.poolV3.withdraw(GNO, undefined, c.avatar),
  // Spark - Withdraw XDAI
  allow.gnosis.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.spark.poolV3,
    undefined,
    c.avatar
  ),
  // Spark - Withdraw WXDAI
  allow.gnosis.spark.poolV3.withdraw(WXDAI, undefined, c.avatar),
  // Spark - Withdraw WETH
  allow.gnosis.spark.poolV3.withdraw(WETH, undefined, c.avatar),
  // Spark - Withdraw USDC.e
  allow.gnosis.spark.poolV3.withdraw(USDCe, undefined, c.avatar),
  // Spark - Withdraw EURe
  allow.gnosis.spark.poolV3.withdraw(EURe, undefined, c.avatar),
  // Spark - Withdraw USDT
  allow.gnosis.spark.poolV3.withdraw(USDT, undefined, c.avatar),
  // Spark - Withdraw USDC
  allow.gnosis.spark.poolV3.withdraw(USDC, undefined, c.avatar),

  // StakeWise v3 - Axol.io
  allow.gnosis.stakeWiseV3.axol.burnOsToken(),
  allow.gnosis.stakeWiseV3.axol.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.axol.claimExitedAssets(),
  // StakeWise v3 - Stakecat
  allow.gnosis.stakeWiseV3.stakecat.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakecat.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.claimExitedAssets(),
  // StakeWise v3 - Stakesaurus
  allow.gnosis.stakeWiseV3.stakesaurus.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakesaurus.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.claimExitedAssets(),
  // StakeWise v3 - Serenita
  allow.gnosis.stakeWiseV3.serenita.burnOsToken(),
  allow.gnosis.stakeWiseV3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.claimExitedAssets(),
  // StakeWise v3 - Genesis
  allow.gnosis.stakeWiseV3.genesis.burnOsToken(),
  allow.gnosis.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.claimExitedAssets(),
  // StakeWise v3 - NEDO
  allow.gnosis.stakeWiseV3.nedo.burnOsToken(),
  allow.gnosis.stakeWiseV3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.claimExitedAssets(),
] satisfies PermissionList
