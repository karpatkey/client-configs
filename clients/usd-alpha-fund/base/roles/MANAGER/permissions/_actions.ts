import { allow as allowAction } from "defi-kit/base"
import { AURA, BAL, GHO, MORPHO, USDC } from "@/addresses/base"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),

  // Morpho Market - USDC/cbETH - id: 0x1c21c59df9db44bf6f645d854ee710a8ca17b479451447e9f56758aee10a2fad
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x1c21c59df9db44bf6f645d854ee710a8ca17b479451447e9f56758aee10a2fad",
    ],
  }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [AURA, BAL, MORPHO] <-> [GHO, USDC]
  allowAction.cowswap.swap({
    sell: [AURA, BAL, MORPHO],
    buy: [GHO, USDC],
  }),

  /*********************************************
   * Bridges
   *********************************************/

  // Circle v1 - Bridge USDC to Arbitrum
  allowAction.circle_v1.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Arbitrum
  allowAction.circle_v1.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

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

  // Circle v1 - Bridge USDC to Optimism
  allowAction.circle_v1.bridge({
    targets: ["Optimism"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Optimism
  allowAction.circle_v1.receive({
    targets: ["Optimism"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
]
