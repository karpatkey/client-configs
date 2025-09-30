import { allow as allowAction } from "defi-kit/gno"
import {
  EURe,
  GHO,
  GNO,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
} from "@/addresses/gno"

export default [
  // Aave v3 - Deposit GHO
  allowAction.aave_v3.deposit({ targets: ["GHO"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),

  // CowSwap - [EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI, XDAI] <-> [EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI],
    buy:  ["XDAI", EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI],
  }),

  // Spark - Deposit EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - Deposit GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
