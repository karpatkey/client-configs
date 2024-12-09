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
} from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { cowswap__swap } from "../../../../../helpers/exit_strategies"
import { Chain } from "../../../../../types"

export default [
  // CowSwap - DAI <> USDT
  cowswap__swap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - DAI <> USDC
  cowswap__swap([DAI, USDC], [DAI, USDC], Chain.eth),

  // CowSwap - USDC <> USDT
  cowswap__swap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - wstETH -> stETH
  cowswap__swap([wstETH], [stETH], Chain.eth),

  // CowSwap - osETH <> WETH
  cowswap__swap([osETH], [WETH], Chain.eth),

  // CowSwap - rETH <> WETH
  cowswap__swap([rETH, WETH], [rETH, WETH], Chain.eth),

  // CowSwap - GHO <> USDC
  cowswap__swap([GHO, USDC], [GHO, USDC], Chain.eth),
] satisfies PermissionList
