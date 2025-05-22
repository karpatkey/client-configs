import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, sUSDS, USDC, USDS, USDT } from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  
  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  
  // TODO: Confirm whether COMP should be a buy or sell token. 
  // I added it as a sell token, since that's the most common case
  // CowSwap - [COMP, DAI, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, sDAI, sUSDS, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, sUSDS, USDC, USDS, USDT],
    buy: [DAI, sDAI, sUSDS, USDC, USDS, USDT],
  }),

  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
]
