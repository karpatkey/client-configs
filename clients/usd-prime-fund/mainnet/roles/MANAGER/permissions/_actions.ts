import { allow as allowAction } from "defi-kit/eth"
import { USDS, stkGHO, USDC, USDT, sUSDS, GHO } from "@/addresses/eth"
import { parameters } from "../../../instances/main"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Spark - Deposit USDS to get sUSDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [USDC, USDS, USDT, sUSDS, GHO, stkGHO] <-> [USDC, USDS, USDT, sUSDS, GHO, stkGHO]
  allowAction.cowswap.swap({
    sell: [USDC, USDS, USDT, sUSDS, GHO, stkGHO],
    buy: [USDC, USDS, USDT, sUSDS, GHO, stkGHO],
  }),

  /*********************************************
   * Bridges
   *********************************************/

  // Circle v2 - Bridge USDC to Arbitrum
  allowAction.circle_v2.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
  // Circle v2 - Bridge USDC to Base
  allowAction.circle_v2.bridge({
    targets: ["Base"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Base
  allowAction.circle_v2.receive({
    targets: ["Base"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
  // Circle v2 - Bridge USDC to Optimism
  allowAction.circle_v2.bridge({
    targets: ["Optimism"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Optimism
  allowAction.circle_v2.receive({
    targets: ["Optimism"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
]
