import { allow as allowAction } from "defi-kit/arb1"
import { USDC, USDS, USDT, WETH } from "@/addresses/arb1"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) => [
  // CowSwap - [ETH, USDC, USDS, USDT, WETH] <-> [ETH, USDC, USDS, USDT, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", USDC, USDS, USDT, WETH],
    buy: ["ETH", USDC, USDS, USDT, WETH],
  }),

  // Circle v2 (CCTP) - Bridge USDC to Ethereum
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 (CCTP) - Receive USDC from Ethereum
  allowAction.circle_v2.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
]
