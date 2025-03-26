import { allow as allowAction } from "defi-kit/eth"
import { USDC } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),

  // CowSwap - ETH <-> USDC
  allowAction.cowswap.swap({
    sell: ["ETH", USDC],
    buy: ["ETH", USDC],
  }),

  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
]
