import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, USDT, WBTC, WETH } from "@/addresses/gno"

export default [
  // CowSwap - [sDAI, USDC, USDC.e, USDT, WBTC, WETH, XDAI] <->
  // [sDAI, USDC, USDC.e, USDT, WBTC, WETH, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", sDAI, USDC, USDCe, USDT, WBTC, WETH],
    buy: ["XDAI", sDAI, USDC, USDCe, USDT, WBTC, WETH],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
