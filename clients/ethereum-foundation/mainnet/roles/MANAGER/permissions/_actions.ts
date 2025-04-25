import { allow as allowAction } from "defi-kit/eth"
import { USDC } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Prime Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["ETH"] }),

  // Compound v3 - Deposit ETH
  allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["WETH"] }),

  // CowSwap - ETH <-> USDC
  allowAction.cowswap.swap({
    sell: ["ETH", USDC],
    buy: ["ETH", USDC],
  }),

  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
]
