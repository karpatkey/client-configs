import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),
  // Aave v3 - Borrow WXDAI
  allowAction.aave_v3.borrow({ targets: ["WXDAI"] }),
  // Aave v3 - Borrow XDAI
  allowAction.aave_v3.borrow({ targets: ["XDAI"] }),

  // CowSwap - [sDAI, USDC, USDCe, WXDAI] -> [ETH, sDAI, USDC, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),
  // Spark - Borrow WXDAI
  allowAction.spark.borrow({ targets: ["WXDAI"] }),
  // Spark - Borrow XDAI
  allowAction.spark.borrow({ targets: ["XDAI"] }),
]
