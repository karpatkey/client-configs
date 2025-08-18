import { allow as allowAction } from "defi-kit/base"
import { parameters } from "../../../instances/main"
import { USDC, MORPHO } from "@/addresses/base"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),

  /*********************************************
   * Bridges
   *********************************************/

  // Circle v2 - Bridge USDC to Mainnet
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Mainnet
  allowAction.circle_v2.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [MORPHO] -> [USDC]
  allowAction.cowswap.swap({
    sell: [MORPHO],
    buy: [USDC],
  }),
]
