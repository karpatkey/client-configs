import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, XAUt } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Deposit/withdraw XAUt (collateral) and USDC (stablecoin supply: it
  // offsets the USDC debt on the same pool)
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC", "XAUt"] }),
  // Aave v3 Core Market - Borrow/repay USDC only: no automation handles a second debt asset
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // CowSwap - XAUt <-> USDC only, for a manual collateral sale / buy back. No stablecoin
  // besides USDC is tradable.
  allowAction.cowswap.swap({
    sell: [XAUt, USDC],
    buy: [XAUt, USDC],
  }),

  // Morpho Vaults - the USDC deployment sleeve: kpk USDC Yield v2, kpk USDC Prime v2 and the
  // KPK-curated YO Ecosystem Vault. (kpk USDC Yield RWA is hand-scoped in calls.ts.)
  allowAction.morphoVaults.deposit({
    targets: [
      morpho.kpkUsdcPrimeV2,
      morpho.kpkUsdcYieldV2,
      morpho.kpkYoEcosystem,
    ],
  }),
]
