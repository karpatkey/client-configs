import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { aura, balancer, GNO } from "@/addresses/gno"

import { Chain, PermissionList } from "../../../../../types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import {
  balancerUnstakeWithdraw,
  balancerWithdraw,
} from "@/exit_strategies/balancer"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap XDAI
  allow.gnosis.wxdai["withdraw"](),

  // Aura - wstETH/COW
  auraWithdrawBalancer(
    aura.aura50WstEth50CowRewarder,
    balancer.b50WstEth50CowPid
  ),

  // Balancer - GBPe/sDAI
  balancerWithdraw(balancer.bGbpeSdaiPid, false),
  // Balancer - wstETH/COW
  balancerUnstakeWithdraw(Chain.gno, balancer.b50WstEth50CowGauge),

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

  // HOP - WXDAI/hDAI Pool
  allow.gnosis.hop.daiLiquidityPool.removeLiquidity(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityImbalance(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityOneToken(),
  allow.gnosis.hop.daiRewards2.withdraw(),
  allow.gnosis.hop.daiRewards2.exit(),

  // Spark - Withdraw GNO
  allow.gnosis.spark.poolV3.withdraw(GNO, undefined, c.avatar),
] satisfies PermissionList
