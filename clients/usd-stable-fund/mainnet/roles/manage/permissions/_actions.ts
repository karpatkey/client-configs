import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, USDC } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Borrow DAI
  allowAction.spark.borrow({ targets: ["DAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),
]
