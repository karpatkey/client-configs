import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  eAddress,
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
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import {
  balancer__swap,
  cowswap__swap,
} from "../../../../../helpers/exit_strategies"
import { Chain } from "../../../../../types"

export default [
  // Balancer - wstETH -> WETH
  balancer__swap(balancer.bStEthStablePid, [wstETH], [WETH]),

  // Balancer - wstETH -> WETH
  balancer__swap(balancer.eclpWstEthWethPid, [wstETH], [WETH]),

  // Balancer - rETH -> WETH
  balancer__swap(balancer.bREthStablePid, [rETH], [WETH]),

  // Balancer - GYD -> USDT
  balancer__swap(balancer.eclpGydUsdtPid, [GYD], [USDT]),

  // Balancer - GYD -> sDAI
  balancer__swap(balancer.eclpGydSdaiPid, [GYD], [sDAI]),

  // Balancer - GYD -> sDAI
  balancer__swap(balancer.eclpGydSdai2Pid, [GYD], [sDAI]),

  // Balancer - GYD -> USDC
  balancer__swap(balancer.eclpGydUsdcPid, [GYD], [USDC]),

  // Balancer - GHO -> [USDC, USDT]
  balancer__swap(balancer.ghoUsdtUsdcPid, [GHO], [USDC, USDT]),

  // CowSwap - [OETH, rETH, stETH, WETH, wstETH] -> [ETH, WETH]
  cowswap__swap(
    [OETH, rETH, stETH, WETH, wstETH],
    [eAddress, WETH],
    Chain.eth,
    200
  ),
  // CowSwap - stkGHO -> GHO
  cowswap__swap([stkGHO], [GHO], Chain.eth, 200),
  // CowSwap - [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, USDC, USDT]
  cowswap__swap(
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

  // Uniswap v3 - Swaps
  allowErc20Approve(
    [OETH, rETH, stETH, WETH, wstETH],
    [contracts.mainnet.uniswapV3.router2]
  ),

  // Uniswap v3 - [OETH, rETH, stETH, WETH, wstETH] -> WETH
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(OETH, rETH, stETH, WETH, wstETH),
    tokenOut: WETH,
    recipient: c.avatar,
  }),

  // Uniswap v3 - Swaps
  allowErc20Approve(
    [DAI, USDT, USDC, GYD, sDAI, GHO, USDS, sUSDS],
    [contracts.mainnet.uniswapV3.router2]
  ),

  // Uniswap v3 - [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, USDC, USDT]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT),
    tokenOut: c.or(DAI, USDT, USDC),
    recipient: c.avatar,
  }),
] satisfies PermissionList
