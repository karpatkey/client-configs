import { allow as allowAction } from "defi-kit/eth"
import { GHO, USDC, USDS, USDT, morpho } from "@/addresses/eth"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 Core Market - Deposit/withdraw USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit/withdraw USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),

  // Compound v3 - Institutional Market (ciUSDCv3) - Deposit/withdraw USDC
  allowAction.compound_v3.deposit({
    targets: ["ciUSDCv3"],
    tokens: ["USDC"],
  }),

  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcPrimeV2] }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
  // Morpho Vault - kpk USDT Prime v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdtPrimeV2] }),

  // Spark - Deposit USDS to get sUSDS / redeem sUSDS for USDS
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
