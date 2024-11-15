import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { aura, balancer, GNO } from "../../../../../eth-sdk/addresses_gno"
import {
  aura__withdraw_balancer,
  balancer__withdraw,
  balancer__unstake_withdraw,
} from "../../../../../helpers/exit_strategies"
import { Chain, PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap XDAI
  allow.gnosis.wxdai["withdraw"](),

  // Aura - wstETH/COW
  aura__withdraw_balancer(
    aura.aura50WSTETH_50COW_rewarder,
    balancer.B_50WSTETH_50COW_pId
  ),

  // Balancer - GBPe/sDAI
  balancer__withdraw(balancer.B_GBPe_sDAI_pId),
  // Balancer - wstETH/COW
  balancer__unstake_withdraw(Chain.gno, balancer.B_50wstETH_50COW_gauge),

  // Curve - EURe/x3CRV
  allow.gnosis.curve.crvEUReUSD_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEUReUSD_pool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  allow.gnosis.curve.crvEUReUSD_zap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEUReUSD_zap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  allow.gnosis.curve.crvEUReUSD_gauge["withdraw(uint256)"](),

  // HOP - WXDAI/hDAI Pool
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidity(),
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidityImbalance(),
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidityOneToken(),
  allow.gnosis.hop.DAI_Rewards_2.withdraw(),
  allow.gnosis.hop.DAI_Rewards_2.exit(),

  // Spark - GNO
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(GNO, undefined, c.avatar),
] satisfies PermissionList
