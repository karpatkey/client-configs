import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, sUSDS, USDC, USDS, USDT } from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Spark - Deposit USDS,DAI,USDC
  allowAction.spark.deposit({ targets: ["USDS", "DAI", "USDC"] }),
  // Spark - Deposit DAI,USDC
  allowAction.spark.deposit({ targets: ["DAI", "USDC"] }),
  // Compound v3 -Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"] })
  // CowSwap - [USDC, USDT, DAI, sDAI, USDS, sUSDS] -> [USDC, USDT, DAI, sDAI, USDS, sUSDS, COMP]
  allowAction.cowswap.swap({
    sell: [USDC, USDT, DAI, sDAI, USDS, sUSDS],
    buy: [USDC, USDT, DAI, sDAI, USDS, sUSDS, COMP],
  }),
]
