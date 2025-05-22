import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // CowSwap - [xDAI, WXDAI, USDC, USDC.e, sxDAI] -> [xDAI, WXDAI, USDC, USDC.e, sxDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", WXDAI, USDC, USDCe, sDAI],
    buy: ["XDAI", WXDAI, USDC, USDCe, sDAI],
  }),
]
