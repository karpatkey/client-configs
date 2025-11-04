import { allow as allowAction } from "defi-kit/arb1"
import { USDC, USDCe } from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Balancer v2 - axlBAL/BAL
  allowAction.balancer_v2.deposit({ targets: ["axlBAL/BAL"] }),

  // Circle v2 - Bridge USDC to Ethereum
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),

  // CowSwap - USDC.e -> USDC
  allowAction.cowswap.swap({
    sell: [USDCe],
    buy: [USDC],
  }),
]
