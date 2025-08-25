import { allow as allowAction } from "defi-kit/eth"
import { COMP, EUL, FLUID, USDC, USDT } from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Circle v2 - Bridge USDC to Arbitrum
  allowAction.circle_v2.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // CowSwap - [COMP, EUL, FLUID] -> [USDC, USDT]
  allowAction.cowswap.swap({
    sell: [COMP, EUL, FLUID],
    buy: [USDC, USDT],
  }),
]
