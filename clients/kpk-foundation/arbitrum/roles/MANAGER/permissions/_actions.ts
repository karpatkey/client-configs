import { allow as allowAction } from "defi-kit/arb1"
import { ARB, EURe, MORPHO, USDC, morpho } from "@/addresses/arb1"
import { kpkFoundationBase } from "../../../../addresses"
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
  // Circle v2 - Bridge USDC to Base
  allowAction.circle_v2.bridge({
    targets: ["Base"],
    recipient: kpkFoundationBase,
  }),
  // Circle v2 - Receive USDC from Base
  allowAction.circle_v2.receive({
    targets: ["Base"],
    sender: kpkFoundationBase,
    recipient: parameters.avatar,
  }),

  // CowSwap - [USDC, EURe, MORPHO, ARB] -> [USDC, EURe]
  allowAction.cowswap.swap({
    sell: [USDC, EURe, MORPHO, ARB],
    buy: [USDC, EURe],
  }),

  // Morpho Vault - kpk EURe Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEureYieldV2],
  }),
]
