import {
  COW,
  EURe, 
  GNO,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
 } from "@/addresses/gno"
import { allow as allowAction } from "defi-kit/gno"

export default [
  // Aave v3 - Deposit EURe
  allowAction.aave_v3.deposit({ targets: ["EURe"] }),
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),

  // CowSwap - [COW, EURe, GNO, sDAI, USDC, USDC.e, USDT, WETH, wstETH, WXDAI, XDAI] <->
  // [COW, EURe, GNO, sDAI, USDC, USDC.e, USDT, WETH, wstETH, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", COW, EURe, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI],
    buy: ["XDAI", COW, EURe, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI],
  }),

  // Spark - Deposit EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - Deposit USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
