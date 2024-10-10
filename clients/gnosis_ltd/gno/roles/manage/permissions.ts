import { c } from "zodiac-roles-sdk"
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

  // Balancer - EURe/GBPe
  allowAction.balancer.deposit({ targets: ["B-50EURe-50GBPe"] }),
  allowAction.balancer.stake({ targets: ["B-50EURe-50GBPe"] }),
  // Balancer - GBPe/sDAI
  allowAction.balancer.deposit({ targets: ["GBPe/sDAI"] }),
  allowAction.balancer.stake({ targets: ["GBPe/sDAI"] }),
  // Balancer - GBPe/WXDAI
  allowAction.balancer.deposit({ targets: ["B-50GBPe-50WXDAI"] }),
  allowAction.balancer.stake({ targets: ["B-50GBPe-50WXDAI"] }),
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
  allow.gnosis.cowswap.vCOW.swapAll(),

  // Curve - EURe/x3CRV
  ...allowErc20Approve([EURe, x3CRV], [contracts.gnosis.curve.crvEUReUSD_pool]),
  allow.gnosis.curve.crvEUReUSD_pool["add_liquidity(uint256[2],uint256)"](),
  allow.gnosis.curve.crvEUReUSD_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEUReUSD_pool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [EURe, USDC, USDT, WXDAI],
    [contracts.gnosis.curve.crvEUReUSD_zap]
  ),
  allow.gnosis.curve.crvEUReUSD_zap["add_liquidity(uint256[4],uint256)"](),
  allow.gnosis.curve.crvEUReUSD_zap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEUReUSD_zap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [curve.crvEUReUSD],
    [contracts.gnosis.curve.crvEUReUSD_gauge]
  ),
  allow.gnosis.curve.crvEUReUSD_gauge["deposit(uint256)"](),
  allow.gnosis.curve.crvEUReUSD_gauge["withdraw(uint256)"](),
  allow.gnosis.curve.crvEUReUSD_gauge["claim_rewards()"](),

  // HOP - WXDAI/hDAI Pool
  ...allowErc20Approve(
    [hDAI, WXDAI],
    [contracts.gnosis.hop.DAI_Liquidity_Pool]
  ),
  allow.gnosis.hop.DAI_Liquidity_Pool.addLiquidity(),
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidity(),
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidityImbalance(),
  allow.gnosis.hop.DAI_Liquidity_Pool.removeLiquidityOneToken(),
  ...allowErc20Approve(
    [contracts.gnosis.hop.LP_DAI],
    [contracts.gnosis.hop.DAI_Rewards_2]
  ),
  allow.gnosis.hop.DAI_Rewards_2.stake(),
  allow.gnosis.hop.DAI_Rewards_2.withdraw(),
  allow.gnosis.hop.DAI_Rewards_2.exit(),
  allow.gnosis.hop.DAI_Rewards_2.getReward(),
] satisfies PermissionList
