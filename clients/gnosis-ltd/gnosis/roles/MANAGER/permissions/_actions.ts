import { allow as allowAction } from "defi-kit/gno"
import { EURe, GBPe, sDAI, USDC, USDCe, USDT, WXDAI } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - wstETH/COW
  allowAction.aura.deposit({ targets: ["20"] }),

  // Balancer v2 - GBPe/sDAI
  allowAction.balancer_v2.deposit({ targets: ["GBPe/sDAI"] }),
  allowAction.balancer_v2.stake({ targets: ["GBPe/sDAI"] }),
  // Balancer v2 - wstETH/COW
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-50COW"] }),

  // CowSwap - XDAI -> [EURe, sDAI, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: ["XDAI"],
    buy: [EURe, sDAI, USDCe, USDT],
  }),
  // CowSwap - [EURe, sDAI, USDC.e, USDT] -> XDAI
  allowAction.cowswap.swap({
    sell: [EURe, sDAI, USDCe, USDT],
    buy: ["XDAI"],
  }),

  // CowSwap - WXDAI -> [EURe, sDAI, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [EURe, sDAI, USDCe, USDT],
  }),
  // CowSwap - [EURe, sDAI, USDC.e, USDT] -> WXDAI
  allowAction.cowswap.swap({
    sell: [EURe, sDAI, USDCe, USDT],
    buy: [WXDAI],
  }),

  // CowSwap - USDC.e <-> USDT
  allowAction.cowswap.swap({
    sell: [USDCe, USDT],
    buy: [USDCe, USDT],
  }),

  // CowSwap - USDC <-> USDC.e
  allowAction.cowswap.swap({
    sell: [USDC, USDCe],
    buy: [USDC, USDCe],
  }),

  // CowSwap - EURe <-> USDC.e
  allowAction.cowswap.swap({
    sell: [EURe, USDCe],
    buy: [EURe, USDCe],
  }),

  // CowSwap - EURe <-> USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDT],
    buy: [EURe, USDT],
  }),

  // CowSwap - GBPe <-> sDAI
  allowAction.cowswap.swap({
    sell: [GBPe, sDAI],
    buy: [GBPe, sDAI],
  }),

  // CowSwap - sDAI <-> USDC.e
  allowAction.cowswap.swap({
    sell: [sDAI, USDCe],
    buy: [sDAI, USDCe],
  }),

  // CowSwap - sDAI <-> USDT
  allowAction.cowswap.swap({
    sell: [sDAI, USDT],
    buy: [sDAI, USDT],
  }),

  // Spark - Deposit GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
