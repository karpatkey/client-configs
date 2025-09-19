import { allow as allowAction } from "defi-kit/gno"
import { GHO, sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [GHO, sDAI, USDC, USDCe, WXDAI, XDAI] <-> [GHO, sDAI, USDC, USDCe, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", GHO, sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", GHO, sDAI, USDC, USDCe, WXDAI],
  }),
]
