import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  GHO,
  GYD,
  OETH,
  rETH,
  sDAI,
  sUSDS,
  stETH,
  stkGHO,
  USDC,
  USDS,
  USDT,
  WETH,
  wstETH,
  balancer,
} from "@/addresses/eth"
import { eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"
import { cowswapSwap } from "@/exit_strategies/cowswap"
import { balancerSwap } from "@/exit_strategies/balancer"
import { Chain } from "../../../../../types"

export default [
  // Balancer - wstETH -> WETH
  balancerSwap(balancer.bStEthStablePid, [wstETH], [WETH]),

  // Balancer - wstETH -> WETH
  balancerSwap(balancer.eclpWstEthWethPid, [wstETH], [WETH]),

  // Balancer - rETH -> WETH
  balancerSwap(balancer.bREthStablePid, [rETH], [WETH]),

  // Balancer - GYD -> USDT
  balancerSwap(balancer.eclpGydUsdtPid, [GYD], [USDT]),

  // Balancer - GYD -> sDAI
  balancerSwap(balancer.eclpGydSdaiPid, [GYD], [sDAI]),

  // Balancer - GYD -> sDAI
  balancerSwap(balancer.eclpGydSdai2Pid, [GYD], [sDAI]),

  // Balancer - GYD -> USDC
  balancerSwap(balancer.eclpGydUsdcPid, [GYD], [USDC]),

  // Balancer - GHO -> [USDC, USDT]
  balancerSwap(balancer.ghoUsdtUsdcPid, [GHO], [USDC, USDT]),

  // CowSwap - [OETH, rETH, stETH, WETH, wstETH] -> [ETH, WETH]
  cowswapSwap(
    [OETH, rETH, stETH, WETH, wstETH],
    [eAddress, WETH],
    Chain.eth,
    200
  ),
  // CowSwap - stkGHO -> GHO
  cowswapSwap([stkGHO], [GHO], Chain.eth, 200),
  // CowSwap - [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, USDC, USDT]
  cowswapSwap(
    [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT],
    [DAI, USDC, USDT],
    Chain.eth,
    200
  ),

  // Curve - Swap stETH -> ETH
  allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool.exchange(1, 0),

  // Curve - Swap OETH -> ETH
  allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
  allow.mainnet.curve.oEthCrvPool["exchange(int128,int128,uint256,uint256)"](
    1,
    0
  ),

  // Uniswap v3 - [OETH, rETH, stETH, WETH, wstETH] -> WETH
  allowErc20Approve(
    [OETH, rETH, stETH, WETH, wstETH],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(OETH, rETH, stETH, WETH, wstETH),
    tokenOut: WETH,
    recipient: c.avatar,
  }),

  // Uniswap v3 - [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, USDC, USDT]
  allowErc20Approve(
    [DAI, USDT, USDC, GYD, sDAI, GHO, USDS, sUSDS],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT),
    tokenOut: c.or(DAI, USDT, USDC),
    recipient: c.avatar,
  }),
] satisfies PermissionList
