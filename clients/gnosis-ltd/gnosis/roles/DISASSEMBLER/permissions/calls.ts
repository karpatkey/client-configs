import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { aura, balancerV2, GNO } from "@/addresses/gno"
import { Chain, PermissionList } from "@/types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import {
  balancerV2UnstakeWithdraw,
  balancerV2Withdraw,
} from "@/exit_strategies/balancerV2"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap XDAI
  allow.gnosis.wxdai["withdraw"](),

  // Aura - wstETH/COW
  auraWithdrawBalancer(
    aura.aura50WstEth50CowRewarder,
    balancerV2.b50WstEth50CowPid
  ),

  // Balancer v2 - GBPe/sDAI
  balancerV2Withdraw(balancerV2.bGbpeSdaiPid, false),
  // Balancer v2 - wstETH/COW
  balancerV2UnstakeWithdraw(Chain.gno, balancerV2.b50WstEth50CowGauge),

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
