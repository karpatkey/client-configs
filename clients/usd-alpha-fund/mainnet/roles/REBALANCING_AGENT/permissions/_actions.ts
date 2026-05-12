import { allow as allowAction } from "defi-kit/eth"
import { GHO, USDC, USDS, morpho } from "@/addresses/eth"

export default [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave Safety Module - Stake/unstake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit/withdraw USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcPrimeV2] }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // Spark - Deposit USDS to get sUSDS / redeem sUSDS for USDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [GHO, USDC, USDS] <-> [GHO, USDC, USDS]
  allowAction.cowswap.swap({
    sell: [GHO, USDC, USDS],
    buy: [GHO, USDC, USDS],
  }),
]
