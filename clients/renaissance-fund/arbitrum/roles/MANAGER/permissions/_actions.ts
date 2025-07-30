import { allow as allowAction } from "defi-kit/arb1"
import { GMX, PENDLE, USDC, WETH } from "@/addresses/arb1"
import { parameters } from "../../../instances/main_prod"

export default [
  // Circle v1 - Bridge USDC to Ethereum
  allowAction.circle_v1.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Ethereum
  allowAction.circle_v1.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Circle v2 - Bridge USDC to Ethereum
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Ethereum
  allowAction.circle_v2.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // CowSwap - [ETH, GMX, PENDLE, USDC, WETH] <-> [ETH, GMX, PENDLE, USDC, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", GMX, PENDLE, USDC, WETH],
    buy: ["ETH", GMX, PENDLE, USDC, WETH],
  }),
]
