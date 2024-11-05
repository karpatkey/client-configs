import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  E_ADDRESS,
  AAVE,
  COMP,
  DAI,
  GHO,
  GYD,
  OETH,
  rETH,
  sDAI,
  sUSDS,
  stETH,
  stkAAVE,
  stkGHO,
  SWISE,
  USDC,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
  balancer,
  maverick,
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
  // Balancer - Swap COMP -> WETH
  balancer__swap(balancer.B_50COMP_50WETH_pId, [COMP], [WETH]),

  // Balancer - Swap WETH -> DAI
  balancer__swap(balancer.B_60WETH_40DAI_pId, [WETH], [DAI]),

  // Balancer - Swap WETH -> USDC
  balancer__swap(balancer.B_50USDC_50WETH_pId, [WETH], [USDC]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [WETH, wstETH]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.ECLP_wstETH_wETH_pId, [WETH, wstETH], [WETH, wstETH]),

  // Balancer - Swap rETH <-> WETH
  balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap GYD <-> USDT
  balancer__swap(balancer.ECLP_GYD_USDT_pId, [GYD, USDT], [GYD, USDT]),

  // Balancer - Swap GYD <-> sDAI
  balancer__swap(balancer.ECLP_GYD_sDAI_pId, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - Swap GYD <-> sDAI
  balancer__swap(balancer.ECLP_GYD_sDAI_2_pId, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - Swap GYD <-> USDC
  balancer__swap(balancer.ECLP_GYD_USDC_pId, [GYD, USDC], [GYD, USDC]),

  // Balancer - Swap GHO <-> GYD
  balancer__swap(balancer.ECLP_GHO_GYD_pId, [GHO, GYD], [GHO, GYD]),

  // Balancer - Swap GHO <-> [USDC, USDT]
  balancer__swap(balancer.GHO_USDT_USDC_pId, [GHO], [USDC, USDT]),
  balancer__swap(balancer.GHO_USDT_USDC_pId, [USDC, USDT], [GHO]),

  // CowSwap - Swapping of AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  cowswap__swap(
    [
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH],
    Chain.eth,
    200
  ),
  // CowSwap - Swapping of DAI, GHO, GYD, sDAI, USDC, USDT
  cowswap__swap(
    [DAI, GHO, GYD, sDAI, USDC, USDT],
    [DAI, GHO, GYD, sDAI, USDC, USDT],
    Chain.eth,
    200
  ),
  // CowSwap - Swap GHO <-> stkGHO
  cowswap__swap([GHO, stkGHO], [GHO, stkGHO], Chain.eth, 200),
  // CowSwap - Swap USDS -> [DAI, sUSDS, USDC, USDT]
  cowswap__swap([USDS], [DAI, sUSDS, USDC, USDT], Chain.eth, 200),
  // CowSwap - Swap sUSDS -> [DAI, USDC, USDS, USDT]
  cowswap__swap([sUSDS], [DAI, USDC, USDS, USDT], Chain.eth, 200),
  // CowSwap - Swap OETH -> [ETH, rETH, stETH, WETH, wstETH]
  cowswap__swap([OETH], [E_ADDRESS, rETH, stETH, WETH, wstETH], Chain.eth, 200),

  // Curve - Swap ETH <-> stETH
  allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - Swap ETH <-> OETH
  allowErc20Approve([OETH], [contracts.mainnet.curve.OETHCRV_f_pool]),
  allow.mainnet.curve.OETHCRV_f_pool["exchange(int128,int128,uint256,uint256)"](
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Maverick - Swap GHO <-> stkGHO
  allowErc20Approve(
    [GHO, stkGHO],
    [contracts.mainnet.maverick.MaverickV2Router]
  ),
  allow.mainnet.maverick.MaverickV2Router.inputSingleWithTickLimit(
    c.avatar,
    maverick.GHO_stkGHO_pool
  ),

  // Uniswap v3 - Swaps
  allowErc20Approve(
    [
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.uniswap_v3.router_2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH
    ),
    tokenOut: c.or(DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH),
    recipient: c.avatar,
  }),
] satisfies PermissionList
