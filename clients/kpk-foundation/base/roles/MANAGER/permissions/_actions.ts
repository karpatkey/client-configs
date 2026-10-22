import { allow as allowAction } from "defi-kit/base"
import { MORPHO, USDC, morpho } from "@/addresses/base"
import { kpkFoundationEth } from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Circle v2 - Bridge USDC to Arbitrum and Ethereum (Foundation Safe 0x17bC... on both)
  allowAction.circle_v2.bridge({
    targets: ["Arbitrum", "Ethereum"],
    recipient: kpkFoundationEth,
  }),
  // Circle v2 - Receive USDC from Arbitrum and Ethereum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum", "Ethereum"],
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
