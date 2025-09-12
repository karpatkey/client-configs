import { allow as allowAction } from "defi-kit/eth"
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

export default [
  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({ sell: [DAI, USDT], buy: [DAI, USDT] }),

  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({ sell: [DAI, USDC], buy: [DAI, USDC] }),

  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({ sell: [USDC, USDT], buy: [USDC, USDT] }),

  // CowSwap - wstETH -> stETH
  allowAction.cowswap.swap({ sell: [wstETH], buy: [stETH] }),

  // CowSwap - osETH <-> WETH
  allowAction.cowswap.swap({ sell: [osETH], buy: [WETH] }),

  // CowSwap - rETH <-> WETH
  allowAction.cowswap.swap({ sell: [rETH, WETH], buy: [rETH, WETH] }),

  // CowSwap - GHO <-> USDC
  allowAction.cowswap.swap({ sell: [GHO, USDC], buy: [GHO, USDC] }),
]
