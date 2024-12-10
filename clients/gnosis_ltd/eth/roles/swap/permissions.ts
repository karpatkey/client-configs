import { DAI, sDAI, USDC, USDT } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { cowswap__swap } from "../../../../../helpers/exit_strategies"
import { Chain } from "../../../../../types"

export default [
  // CowSwap - DAI <> USDC
  cowswap__swap([DAI, USDC], [DAI, USDC], Chain.eth),

  // CowSwap - DAI <> USDT
  cowswap__swap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - USDC <> USDT
  cowswap__swap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - sDAI <> USDC
  cowswap__swap([sDAI, USDC], [sDAI, USDC], Chain.eth),

  // CowSwap - sDAI <> USDT
  cowswap__swap([sDAI, USDT], [sDAI, USDT], Chain.eth),
] satisfies PermissionList
