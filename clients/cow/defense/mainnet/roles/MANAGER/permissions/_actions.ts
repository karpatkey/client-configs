import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  USDC,
  USDS,
  USDT,
  WETH,
} from "@/addresses/eth"

export default [
  // CowSwap - [DAI, ETH, USDC, USDS, USDT, WETH] <-> [DAI, ETH, USDC, USDS, USDT, WETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      DAI,
      USDC,
      USDS,
      USDT,
      WETH,
    ],
    buy: [
      "ETH",
      DAI,
      USDC,
      USDS,
      USDT,
      WETH,
    ],
  }),
]
