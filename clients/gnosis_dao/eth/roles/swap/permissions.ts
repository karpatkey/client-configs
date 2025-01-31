import {
  DAI,
  GHO,
  rETH,
  osETH,
  USDC,
  USDT,
  WETH,
  stETH,
  wstETH,
} from "@/addresses/eth"
import { PermissionList } from "../../../../../types"
import { cowswapSwap } from "@/exit_strategies/cowswap"
import { Chain } from "../../../../../types"

export default [
  // CowSwap - DAI <-> USDT
  cowswapSwap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - DAI <-> USDC
  cowswapSwap([DAI, USDC], [DAI, USDC], Chain.eth),

  // CowSwap - USDC <-> USDT
  cowswapSwap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - wstETH -> stETH
  cowswapSwap([wstETH], [stETH], Chain.eth),

  // CowSwap - osETH <-> WETH
  cowswapSwap([osETH], [WETH], Chain.eth),

  // CowSwap - rETH <-> WETH
  cowswapSwap([rETH, WETH], [rETH, WETH], Chain.eth),

  // CowSwap - GHO <-> USDC
  cowswapSwap([GHO, USDC], [GHO, USDC], Chain.eth),
] satisfies PermissionList
