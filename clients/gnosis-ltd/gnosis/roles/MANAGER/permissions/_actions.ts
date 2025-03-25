import { allow as allowAction } from "defi-kit/gno"
import { EURe, USDC, USDCe, USDT, WXDAI } from "@/addresses/gno"

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

  // CowSwap - XDAI -> [EURe, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: ["XDAI"],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - [EURe, USDC.e, USDT] -> XDAI
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: ["XDAI"],
  }),

  // CowSwap - WXDAI -> [EURe, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - [EURe, USDC.e, USDT] -> WXDAI
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
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

  // Spark - Deposit GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
]
