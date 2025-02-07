import { allow as allowAction } from "defi-kit/gno"
import { GNO, sDAI, USDC, USDT, WETH } from "@/addresses/gno"
import { PermissionList } from "@/types"

export default [
  // CowSwap - Swap sDAI <-> [XDAI, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [sDAI],
    buy: ["XDAI", USDC, USDT],
    feeAmountBp: 200,
  }),
  allowAction.cowswap.swap({
    sell: ["XDAI", USDC, USDT],
    buy: [sDAI],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap GNO <-> WETH
  allowAction.cowswap.swap({
    sell: [GNO, WETH],
    buy: [GNO, WETH],
    feeAmountBp: 200,
  }),
] satisfies PermissionList
