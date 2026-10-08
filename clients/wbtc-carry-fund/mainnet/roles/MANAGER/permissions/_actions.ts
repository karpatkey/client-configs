import { allow as allowAction } from "defi-kit/eth"
import { cbBTC, morpho, USDC, WBTC } from "@/addresses/eth"

export default [
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // CowSwap - WBTC/cbBTC <-> USDC, and WBTC <-> cbBTC. cbBTC is the fund's second BTC
  // collateral on the Aave v4 Bluechip Spoke.
  allowAction.cowswap.swap({
    sell: [WBTC, cbBTC, USDC],
    buy: [WBTC, cbBTC, USDC],
  }),
]
