import { allow as allowAction } from "defi-kit/arb1"
import { GMX, USDC, WETH } from "@/addresses/arb1"
import { parameters } from "../../../instances/main"

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

  // CowSwap - [ETH, GMX, USDC, WETH] <-> [ETH, GMX, USDC, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", GMX, USDC, WETH],
    buy: ["ETH", GMX, USDC, WETH],
  }),
]
