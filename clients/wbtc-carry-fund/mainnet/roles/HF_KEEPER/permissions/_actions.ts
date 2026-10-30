import { allow as allowAction } from "defi-kit/eth"
import { frxUSD, morpho, USDC, USDG, USDT } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Borrow/repay USDC for the avatar (onBehalfOf pinned): the debt leg of
  // aave_v3_health_factor_manager when the fund runs on Aave v3 Core
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // CowSwap - USD stablecoins between each other, both ways: USDG borrowed on the Aave v4 Core
  // Hub goes into the USDC vaults, USDC from the vaults is swapped back to USDG or frxUSD to
  // repay, and any USD stablecoin the fund ends up holding (incl. USDT) can be converted.
  allowAction.cowswap.swap({
    sell: [frxUSD, USDC, USDG, USDT],
    buy: [frxUSD, USDC, USDG, USDT],
  }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
]
