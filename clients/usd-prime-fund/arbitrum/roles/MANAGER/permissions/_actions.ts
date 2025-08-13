import { allow as allowAction } from "defi-kit/arb1"
import { USDC, USDT } from "@/addresses/arb1"
import { parameters } from "../../../instances/main"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),

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

  // CowSwap - [USDC, USDT] -> [USDC, USDT]
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
]
