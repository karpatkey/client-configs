import { allow as allowAction } from "defi-kit/eth"
import {
  cbBTC,
  cirBTC,
  frxUSD,
  GHO,
  morpho,
  RLUSD,
  syrupUSDC,
  syrupUSDG,
  syrupUSDT,
  USDC,
  USDG,
  USDS,
  USDT,
  WBTC,
} from "@/addresses/eth"

export default [
  // Morpho Vaults - the liquid sleeve: kpk USDC Yield v2, and kpk USDC / USDT Prime v2 as
  // more liquid alternatives
  allowAction.morphoVaults.deposit({
    targets: [
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdcPrimeV2,
      morpho.kpkUsdtPrimeV2,
    ],
  }),

  // CowSwap - the BTC set: WBTC / cbBTC / cirBTC between themselves and against USDC
  // (deposit-asset conversions, and selling collateral to repay in an emergency).
  allowAction.cowswap.swap({
    sell: [WBTC, cbBTC, cirBTC, USDC],
    buy: [WBTC, cbBTC, cirBTC, USDC],
  }),

  // CowSwap - the stablecoin set, kept apart from the BTC set so no stablecoin besides USDC
  // becomes tradable against the collateral. Covers borrowing one stablecoin and deploying
  // another, both ways: USDG borrowed on the Aave v4 Core Hub swapped to USDC for the Morpho
  // vaults and back to repay; USDT for the syrupUSDT loop; GHO / frxUSD / RLUSD / USDS if
  // borrowed on Aave or Spark.
  allowAction.cowswap.swap({
    sell: [USDC, USDT, USDG, GHO, frxUSD, RLUSD, USDS],
    buy: [USDC, USDT, USDG, GHO, frxUSD, RLUSD, USDS],
  }),

  // CowSwap - sell-only emergency exit for the loop collateral, for when Maple's
  // redemption queue is too slow: syrup tokens into the stablecoin each loop borrows.
  allowAction.cowswap.swap({
    sell: [syrupUSDG, syrupUSDT, syrupUSDC],
    buy: [USDC, USDT, USDG],
  }),

  // Aave v3 Core - backup borrow venue for the BTC leg, and the syrupUSDT loop (e-mode 33,
  // set through `setUserEMode` in calls.ts). cirBTC is scoped in calls.ts until defi-kit
  // lists it.
  allowAction.aave_v3.deposit({
    market: "Core",
    targets: ["WBTC", "cbBTC", "syrupUSDT", "USDC", "USDT", "USDG"],
  }),
  allowAction.aave_v3.borrow({
    market: "Core",
    targets: ["USDC", "USDT", "USDG", "GHO", "RLUSD"],
  }),

  // Spark - backstop borrow venue at scale (USDS, then USDS -> USDC on CowSwap)
  allowAction.spark.deposit({ targets: ["WBTC", "cbBTC"] }),
  allowAction.spark.borrow({ targets: ["USDS", "USDT", "USDC"] }),

  // Compound v3 - lowest-priority backup borrow venue
  allowAction.compound_v3.deposit({
    targets: ["cUSDCv3", "cUSDTv3"],
    tokens: ["WBTC", "cbBTC"],
  }),
  allowAction.compound_v3.borrow({ targets: ["USDC", "USDT"] }),
]
