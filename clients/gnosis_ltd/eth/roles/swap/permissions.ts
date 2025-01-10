import { DAI, sDAI, USDC, USDT } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { cowswapSwap } from "../../../../../helpers/exit_strategies"
import { Chain } from "../../../../../types"

export default [
  // CowSwap - DAI <-> USDC
  cowswapSwap([DAI, USDC], [DAI, USDC], Chain.eth),

  // CowSwap - DAI <-> USDT
  cowswapSwap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - USDC <-> USDT
  cowswapSwap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - sDAI <-> USDC
  cowswapSwap([sDAI, USDC], [sDAI, USDC], Chain.eth),

  // CowSwap - sDAI <-> USDT
  cowswapSwap([sDAI, USDT], [sDAI, USDT], Chain.eth),
] satisfies PermissionList
