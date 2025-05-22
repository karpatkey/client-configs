import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, sUSDS, USDC, USDS, USDT } from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Spark - Deposit SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Compound v3 -Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"] }),
  // CowSwap - [USDC, USDT, DAI, sDAI, USDS, sUSDS] -> [USDC, USDT, DAI, sDAI, USDS, sUSDS, COMP]
  allowAction.cowswap.swap({
    sell: [USDC, USDT, DAI, sDAI, USDS, sUSDS],
    buy: [USDC, USDT, DAI, sDAI, USDS, sUSDS, COMP],
  }),
]
