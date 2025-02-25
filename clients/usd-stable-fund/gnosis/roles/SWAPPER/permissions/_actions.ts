import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"

export default [
  // CowSwap - [sDAI, USDC, USDCe, WXDAI] -> [XDAI, sDAI, USDC, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", sDAI, USDC, USDCe, WXDAI],
  }),
]
