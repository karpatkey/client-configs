import { allow as allowAction } from "defi-kit/eth"
import { DAI, sDAI, USDC, USDT } from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - Lock
  allowAction.aura.lock(),

  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({
    sell: [DAI, USDC],
    buy: [DAI, USDC],
  }),
  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({
    sell: [DAI, USDT],
    buy: [DAI, USDT],
  }),
  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
  // CowSwap - sDAI <-> USDC
  allowAction.cowswap.swap({
    sell: [sDAI, USDC],
    buy: [sDAI, USDC],
  }),
  // CowSwap - sDAI <-> USDT
  allowAction.cowswap.swap({
    sell: [sDAI, USDT],
    buy: [sDAI, USDT],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
