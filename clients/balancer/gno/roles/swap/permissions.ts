import { allow as allowAction } from "defi-kit/gno"
import {
  GNO,
  sDAI,
  USDC,
  USDT,
  WETH,
} from "../../../../../eth-sdk/addresses_gno"
import { PermissionList } from "../../../../../types"

export default [
  // CowSwap - Swap sDAI <-> [XDAI, USDC, USDT]
  allowAction.cowSwap.swap({
    sell: [sDAI],
    buy: ["XDAI", USDC, USDT],
    feeAmountBp: 200,
  }),
  allowAction.cowSwap.swap({
    sell: ["XDAI", USDC, USDT],
    buy: [sDAI],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap GNO <-> WETH
  allowAction.cowSwap.swap({
    sell: [GNO, WETH],
    buy: [GNO, WETH],
    feeAmountBp: 200,
  }),
] satisfies PermissionList
