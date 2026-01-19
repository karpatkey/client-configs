import { allow as allowAction } from "defi-kit/arb1"
import { ARB, MORPHO, USDC, morpho } from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
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

  // CowSwap - [ARB, MORPHO] -> [USDC]
  allowAction.cowswap.swap({
    sell: [ARB, MORPHO],
    buy: [USDC],
  }),

  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdc],
  }),
]
