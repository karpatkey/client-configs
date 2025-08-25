import { allow as allowAction } from "defi-kit/base"
import { MORPHO, USDC } from "@/addresses/base"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
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

  // CowSwap - [MORPHO, USDC] <-> [MORPHO, USDC]
  allowAction.cowswap.swap({
    sell: [MORPHO, USDC],
    buy: [MORPHO, USDC],
  }),
]
