import { allow as allowAction } from "defi-kit/eth"
import { GHO, USDC, USDS, USDT, morpho } from "@/addresses/eth"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 Core Market - Deposit USDC, USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC", "USDT"] }),

  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcPrimeV2] }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
  // Morpho Vault - kpk USDT Prime v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdtPrimeV2] }),

  // Spark - Deposit USDS to get sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [GHO, USDC, USDS, USDT] <-> [GHO, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [GHO, USDC, USDS, USDT],
    buy: [GHO, USDC, USDS, USDT],
  }),
]
