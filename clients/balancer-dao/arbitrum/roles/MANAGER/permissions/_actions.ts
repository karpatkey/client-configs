import { allow as allowAction } from "defi-kit/arb1"
import { USDC, USDCe } from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Circle v2 - Bridge USDC to Ethereum
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),

  // CowSwap - USDC -> USDC.e
    allowAction.cowswap.swap({
      sell: [USDCe],
      buy: [USDC],
    }),
]