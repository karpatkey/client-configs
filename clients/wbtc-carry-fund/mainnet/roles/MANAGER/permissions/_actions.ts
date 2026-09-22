import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, WBTC } from "@/addresses/eth"

export default [
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // CowSwap - WBTC <-> USDC
  allowAction.cowswap.swap({
    sell: [WBTC, USDC],
    buy: [WBTC, USDC],
  }),
]
