import { allow as allowAction } from "defi-kit/arb1"
import { AURA, BAL, GHO, USDC, USDT } from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),

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

  // CowSwap - [AURA, BAL, GHO, USDC, USDT] <-> [USDC, USDT]
  allowAction.cowswap.swap({
    sell: [AURA, BAL, GHO, USDC, USDT],
    buy: [GHO, USDC, USDT],
  }),
]
