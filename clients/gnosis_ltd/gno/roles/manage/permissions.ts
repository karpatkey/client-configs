import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { contracts } from "../../../../../eth-sdk/config"
import {
  EURe,
  hDAI,
  USDC,
  USDCe,
  USDT,
  WXDAI,
  x3CRV,
  curve,
} from "../../../../../eth-sdk/addresses_gno"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - wstETH/COW
  allowAction.aura.deposit({ targets: ["20"] }),

  // Balancer - GBPe/sDAI
  allowAction.balancer.deposit({ targets: ["GBPe/sDAI"] }),
  allowAction.balancer.stake({ targets: ["GBPe/sDAI"] }),
  // Balancer - wstETH/COW
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50COW"] }),

  // CowSwap - XDAI -> EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: ["XDAI"],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - XDAI <- EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: ["XDAI"],
  }),

  // CowSwap - WXDAI -> EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - WXDAI <- EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: [WXDAI],
  }),

  // CowSwap - USDC.e <-> USDT
  allowAction.cowswap.swap({
    sell: [USDCe, USDT],
    buy: [USDCe, USDT],
  }),

  // CowSwap - USDC <-> USDC.e
  allowAction.cowswap.swap({
    sell: [USDC, USDCe],
    buy: [USDC, USDCe],
  }),

  // CowSwap - EURe <-> USDC.e
  allowAction.cowswap.swap({
    sell: [EURe, USDCe],
    buy: [EURe, USDCe],
  }),

  // CowSwap - EURe <-> USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDT],
    buy: [EURe, USDT],
  }),

  // Spark - GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  // CowSwap - vCOW
  allow.gnosis.cowSwap.vCow.swapAll(),

  // Curve - EURe/x3CRV
  ...allowErc20Approve([EURe, x3CRV], [contracts.gnosis.curve.crvEureUsdPool]),
  allow.gnosis.curve.crvEureUsdPool["add_liquidity(uint256[2],uint256)"](),
  allow.gnosis.curve.crvEureUsdPool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEureUsdPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [EURe, USDC, USDT, WXDAI],
    [contracts.gnosis.curve.crvEureUsdZap]
  ),
  allow.gnosis.curve.crvEureUsdZap["add_liquidity(uint256[4],uint256)"](),
  allow.gnosis.curve.crvEureUsdZap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEureUsdZap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [curve.crvEUReUSD],
    [contracts.gnosis.curve.crvEureUsdGauge]
  ),
  allow.gnosis.curve.crvEureUsdGauge["deposit(uint256)"](),
  allow.gnosis.curve.crvEureUsdGauge["withdraw(uint256)"](),
  allow.gnosis.curve.crvEureUsdGauge["claim_rewards()"](),

  // HOP - WXDAI/hDAI Pool
  ...allowErc20Approve([hDAI, WXDAI], [contracts.gnosis.hop.daiLiquidityPool]),
  allow.gnosis.hop.daiLiquidityPool.addLiquidity(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidity(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityImbalance(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityOneToken(),
  ...allowErc20Approve(
    [contracts.gnosis.hop.lpDai],
    [contracts.gnosis.hop.daiRewards2]
  ),
  allow.gnosis.hop.daiRewards2.stake(),
  allow.gnosis.hop.daiRewards2.withdraw(),
  allow.gnosis.hop.daiRewards2.exit(),
  allow.gnosis.hop.daiRewards2.getReward(),
] satisfies PermissionList
