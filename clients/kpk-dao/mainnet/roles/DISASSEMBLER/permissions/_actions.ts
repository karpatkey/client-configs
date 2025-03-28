import { allow as allowAction } from "defi-kit/eth"
import {
  CRV,
  COMP,
  CVX,
  DAI,
  NOTE,
  rETH,
  USDC,
  USDT,
  WETH,
} from "@/addresses/eth"

export default [
  // CowSwap - [DAI, USDC, USDT] -> [DAI, USDC, USDT, WETH]
  allowAction.cowswap.swap({
    sell: [DAI, USDC, USDT],
    buy: [DAI, USDC, USDT, WETH],
  }),
  // CowSwap - [CRV, COMP, CVX, NOTE] -> [DAI, USDC]
  allowAction.cowswap.swap({ sell: [CRV, COMP, CVX, NOTE], buy: [DAI, USDC] }),

  // CowSwap - DAI -> [ETH, USDC, USDT]
  allowAction.cowswap.swap({ sell: [DAI], buy: ["ETH", USDC, USDT] }),

  // CowSwap - USDT ->[ETH, DAI, USDC]
  allowAction.cowswap.swap({ sell: [USDT], buy: ["ETH", DAI, USDC] }),

  // Cowswap - USDC -> [ETH, DAI, USDT]
  allowAction.cowswap.swap({ sell: [USDC], buy: ["ETH", DAI, USDT] }),

  // Cowswap - [ETH, WETH] -> [DAI, USDC, USDT]
  allowAction.cowswap.swap({ sell: ["ETH", WETH], buy: [DAI, USDC, USDT] }),
]
