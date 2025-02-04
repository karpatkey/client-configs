/*********************************************
 * DeFi-Kit permissions
 *********************************************/

import { allow as allowAction } from "defi-kit/eth"
import { GHO, stkGHO } from "@/addresses/eth"

export default [
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
  }),

  allowAction.aave_v3.stake({ targets: ["GHO"] }),
]
