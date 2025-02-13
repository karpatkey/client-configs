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
  USDC,
  USDS,
  USDT,
  WETH,
  wstETH,
  balancerV2,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerSwap } from "@/exit_strategies/balancer"

export default [
  // Balancer - wstETH -> WETH
  balancerSwap(balancerV2.bStEthStablePid, [wstETH], [WETH]),

  // Balancer - wstETH -> WETH
  balancerSwap(balancerV2.eclpWstEthWethPid, [wstETH], [WETH]),

  // Balancer - rETH -> WETH
  balancerSwap(balancerV2.bREthStablePid, [rETH], [WETH]),

  // Balancer - GYD -> USDT
  balancerSwap(balancerV2.eclpGydUsdtPid, [GYD], [USDT]),

  // Balancer - GYD -> sDAI
  balancerSwap(balancerV2.eclpGydSdaiPid, [GYD], [sDAI]),

  // Balancer - GYD -> sDAI
  balancerSwap(balancerV2.eclpGydSdai2Pid, [GYD], [sDAI]),

  // Balancer - GYD -> USDC
  balancerSwap(balancerV2.eclpGydUsdcPid, [GYD], [USDC]),

  // Balancer - GHO -> [USDC, USDT]
  balancerSwap(balancerV2.ghoUsdtUsdcPid, [GHO], [USDC, USDT]),

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
