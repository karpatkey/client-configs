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
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import {
  aura__withdraw_balancer,
  balancer__unstake_withdraw,
  balancer__withdraw,
} from "../../../../../helpers/exit_strategies"
import { Chain, PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap XDAI
  allow.gnosis.wxdai["withdraw"](),

  // Aave v3 - Deposit XDAI
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.aaveV3.lendingPoolV3,
    undefined,
    c.avatar
  ),
  // Aave v3 - Deposit WXDAI
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(WXDAI, undefined, c.avatar),
  // Aave v3 - Deposit wstETH
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(wstETH, undefined, c.avatar),
  // Aave v3 - Deposit WETH
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(WETH, undefined, c.avatar),
  // Aave v3 - Deposit USDC
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Deposit EURe
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(EURe, undefined, c.avatar),
  // Aave v3 - Deposit GNO
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(GNO, undefined, c.avatar),
  // Aave v3 - Deposit USDC.e
  allow.gnosis.aaveV3.lendingPoolV3.withdraw(USDCe, undefined, c.avatar),

  // Arrakis - WETH/sDAI
  allow.gnosis.arrakis.signMessageLib.signMessage(undefined, {
    delegatecall: true,
  }),
  allow.gnosis.arrakis.router.removeLiquidityPermit2({
    removeData: {
      vault: contracts.gnosis.arrakis.wethSdaiVault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: {
        token: contracts.gnosis.arrakis.wethSdaiVault,
      },
    },
  }),

  // Arrakis - WETH/wstETH
  // signMessage() already included
  allow.gnosis.arrakis.router.removeLiquidityPermit2({
    removeData: {
      vault: contracts.gnosis.arrakis.wethWstEthVault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: {
        token: contracts.gnosis.arrakis.wethWstEthVault,
      },
    },
  }),

  // Aura - WETH/wstETH
  aura__withdraw_balancer(
    aura.auraWETH_WSTETH_rewarder,
    balancer.WETH_WSTETH_pId
  ),
  // Aura - EURe/sDAI
  aura__withdraw_balancer(aura.auraEure_sDAI_rewarder, balancer.Eure_sDAI_pId),
  // Aura - Gyroscope ECLP rETH/WETH
  aura__withdraw_balancer(
    aura.auraRETH_WETH_rewarder,
    balancer.ECLP_RETH_WETH_pId
  ),

  // Azuro - XDAI LP
  allow.gnosis.azuro.lpAzrXdai.withdrawLiquidity(),

  // Balancer - wstETH/GNO
  balancer__unstake_withdraw(Chain.gno, balancer.B_50wstETH_50GNO_gauge),
  // Balancer - sDAI/wstETH
  balancer__unstake_withdraw(Chain.gno, balancer.B_50sDAI_50wstETH_gauge),
  // Balancer - USDC.e/USDT/sDAI
  balancer__unstake_withdraw(Chain.gno, balancer.sBAL3_2_gauge),
  // Balancer - WETH/wstETH
  balancer__unstake_withdraw(Chain.gno, balancer.bb_WETH_wstETH_gauge),
  // Balancer - rETH/WETH
  balancer__unstake_withdraw(Chain.gno, balancer.ECLP_rETH_WETH_gauge),
  // Balancer - osGNO/GNO
  balancer__unstake_withdraw(Chain.gno, balancer.osGNO_GNO_gauge),
  // Balancer - WBTC/WETH
  balancer__withdraw(balancer.B_50WBTC_50WETH_pId),
  // Balancer - Gyroscope ECLP wstETH/WETH
  balancer__unstake_withdraw(Chain.gno, balancer.ECLP_wstETH_WETH_gauge),
  // Balancer - wstETH/BAL/AURA
  balancer__unstake_withdraw(Chain.gno, balancer.B_50wstETH_25BAL_25AURA_gauge),
  // Balancer - wstETH/COW
  balancer__unstake_withdraw(Chain.gno, balancer.B_50wstETH_50COW_gauge),
  // Balancer - COW/GNO
  balancer__unstake_withdraw(Chain.gno, balancer.B_50COW_50GNO_gauge),
  // Balancer - stEUR/EURe
  balancer__unstake_withdraw(Chain.gno, balancer.stEUR_EURe_gauge),
  // Balancer - GIV/GNO
  balancer__withdraw(balancer.B_50GIV_50GNO_pId),
  // Balancer - WXDAI/GNO
  balancer__withdraw(balancer.WXDAI_GNO_pId),
  // Balancer - EURe/sDAI
  balancer__unstake_withdraw(Chain.gno, balancer.EURe_sDAI_gauge),
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

  // Spark - DSR/sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  // Spark - GNO
  allow.gnosis.spark.lendingPoolV3.withdraw(GNO, undefined, c.avatar),
  // Spark - XDAI
  allow.gnosis.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.spark.lendingPoolV3,
    undefined,
    c.avatar
  ),
  // Spark - WXDAI
  allow.gnosis.spark.lendingPoolV3.withdraw(WXDAI, undefined, c.avatar),
  // Spark - WETH
  allow.gnosis.spark.lendingPoolV3.withdraw(WETH, undefined, c.avatar),
  // Spark - USDC.e
  allow.gnosis.spark.lendingPoolV3.withdraw(USDCe, undefined, c.avatar),
  // Spark - EURe
  allow.gnosis.spark.lendingPoolV3.withdraw(EURe, undefined, c.avatar),
  // Spark - USDT
  allow.gnosis.spark.lendingPoolV3.withdraw(USDT, undefined, c.avatar),
  // Spark - USDC
  allow.gnosis.spark.lendingPoolV3.withdraw(USDC, undefined, c.avatar),

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
