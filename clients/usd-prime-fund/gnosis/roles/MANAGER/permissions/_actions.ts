import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDCe, WXDAI } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),

  // CowSwap - [XDAI, sDAI, USDCe, WXDAI] <-> [XDAI, sDAI, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", sDAI, USDCe, WXDAI],
    buy: ["XDAI", sDAI, USDCe, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
