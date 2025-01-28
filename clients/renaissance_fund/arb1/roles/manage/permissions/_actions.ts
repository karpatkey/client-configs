import { allow as allowAction } from "defi-kit/arb1"
import { GMX, USDC } from "@/addresses/arb1"

export default [
  // CowSwap - Swap GMX <-> USDC
  allowAction.cowswap.swap({
    sell: [GMX, USDC],
    buy: [GMX, USDC],
  }),
]
