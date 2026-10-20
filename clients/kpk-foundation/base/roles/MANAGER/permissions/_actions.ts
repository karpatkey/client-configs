import { allow as allowAction } from "defi-kit/base"
import { MORPHO, USDC, morpho } from "@/addresses/base"
import { kpkFoundationEth } from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Circle v2 - Bridge USDC to Ethereum and Arbitrum (Foundation Safe 0x17bC... on both)
  allowAction.circle_v2.bridge({
    targets: ["Ethereum", "Arbitrum"],
    recipient: kpkFoundationEth,
  }),
  // Circle v2 - Receive USDC from Ethereum and Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Ethereum", "Arbitrum"],
    sender: kpkFoundationEth,
    recipient: parameters.avatar,
  }),

  // CowSwap - MORPHO -> USDC
  allowAction.cowswap.swap({
    sell: [MORPHO],
    buy: [USDC],
  }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV2],
  }),
]
