import { allow as allowAction } from "defi-kit/eth"
import { morpho } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Borrow/repay USDC for the avatar (onBehalfOf pinned): the debt leg.
  // No other borrow asset.
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Morpho Vaults - the USDC menu: kpk USDC Yield v2, kpk USDC Prime v2 and the KPK-curated YO
  // Ecosystem Vault. yoUSD Edge (deposit only) is hand-scoped in calls.ts.
  allowAction.morphoVaults.deposit({
    targets: [
      morpho.kpkUsdcPrimeV2,
      morpho.kpkUsdcYieldV2,
      morpho.kpkYoEcosystem,
    ],
  }),
]
