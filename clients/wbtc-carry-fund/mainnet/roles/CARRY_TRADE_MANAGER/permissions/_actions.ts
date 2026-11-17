import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, USDG } from "@/addresses/eth"

export default [
  // Aave v3 Core Market (venue_kind: aave_v3) - Borrow/repay USDC and USDT for the avatar
  // (onBehalfOf pinned): the debt leg when the fund runs on Aave v3 Core instead of the v4 Core
  // Hub lines. Also approves each asset to the Pool for the repay. No GHO, USDG or RLUSD.
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC", "USDT"] }),

  // Spark (venue_kind: spark) - Borrow/repay USDC and USDT for the avatar (onBehalfOf pinned),
  // with the approvals for the repay. No USDS. The WBTC collateral legs are hand-scoped in
  // calls.ts.
  allowAction.spark.borrow({ targets: ["USDC", "USDT"] }),

  // Morpho Blue (venue_kind: morpho_market) - the USDC/WBTC (86%) and USDT/WBTC (86%) markets,
  // pinned by id: supplyCollateral, withdrawCollateral, borrow and repay, with onBehalf and
  // receiver fixed to the avatar and empty callback data, plus the WBTC / USDC / USDT approvals
  // to Morpho Blue. No other market.
  // - USDC/WBTC (86%) - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  // - USDT/WBTC (86%) - id: 0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49",
      "0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99",
    ],
  }),

  // CowSwap - USDG <-> USDC both ways (sell and buy orders): USDG borrowed on the Aave v4 Core
  // Hub line is sold for USDC before it goes into the vaults, and USDC is swapped back to USDG
  // to repay. Same scope as HF_KEEPER.
  allowAction.cowswap.swap({ sell: [USDC, USDG], buy: [USDC, USDG] }),

  // Morpho Vaults - kpk USDC Yield v2, and kpk USDC Prime v2 / kpk USDT Prime v2 where a
  // borrowed USDC or USDT is parked (the automation has no swap leg): deposit, withdraw and
  // redeem with receiver and owner fixed to the avatar, plus the approval of the vault's asset.
  // No forceDeallocate on the Prime vaults.
  allowAction.morphoVaults.deposit({
    targets: [
      morpho.kpkUsdcPrimeV2,
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdtPrimeV2,
    ],
  }),
]
