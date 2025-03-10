import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  GHO,
  GNO,
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
} from "@/addresses/eth"

export default [
  // CowSwap - [OETH, rETH, stETH, WETH, wstETH] -> [ETH, WETH]
  allowAction.cowswap.swap({
    sell: [OETH, rETH, stETH, WETH, wstETH],
    buy: ["ETH", WETH],
    feeAmountBp: 200,
  }),

  // CowSwap - stkGHO -> GHO
  allowAction.cowswap.swap({
    sell: [stkGHO],
    buy: [GHO],
    feeAmountBp: 200,
  }),

  // CowSwap - [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [DAI, GHO, GYD, sDAI, sUSDS, USDC, USDS, USDT],
    buy: [DAI, USDC, USDT],
    feeAmountBp: 200,
  }),
]
