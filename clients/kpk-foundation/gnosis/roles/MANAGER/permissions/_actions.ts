import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - [sDAI, USDC, USDC.e, WXDAI, XDAI] -> [sDAI, USDC, USDC.e, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  
]
