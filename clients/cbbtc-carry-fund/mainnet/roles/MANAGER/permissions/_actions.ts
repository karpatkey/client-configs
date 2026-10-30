import { allow as allowAction } from "defi-kit/eth"
import {
  cbBTC,
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
} from "@/addresses/eth"

export default [
  // Aave v3 Core - backup borrow venue for the BTC leg (cbBTC LT 78%), and the syrupUSDT loop (e-mode 33,
  // set through `setUserEMode` in calls.ts).
  allowAction.aave_v3.borrow({
    market: "Core",
    targets: ["GHO", "RLUSD", "USDC", "USDG", "USDT"],
  }),
  allowAction.aave_v3.deposit({
    market: "Core",
    targets: ["cbBTC", "syrupUSDT", "USDC", "USDG", "USDT"],
  }),

  // CowSwap - cbBTC <-> USDC only (selling collateral to repay in an emergency, and buying
  // it back). No other BTC wrapper (WBTC, cirBTC): swapping into one would move the fund
  // off its deposit asset, and each wrapper gets its own fund.
  allowAction.cowswap.swap({
    sell: [cbBTC, USDC],
    buy: [cbBTC, USDC],
  }),

  // CowSwap - the stablecoin set, kept apart from the BTC set so no stablecoin besides USDC
  // becomes tradable against the collateral. Covers borrowing one stablecoin and deploying
  // another, both ways: USDG borrowed on the Aave v4 Core Hub swapped to USDC for the Morpho
  // vaults and back to repay; USDT for the syrupUSDT loop; GHO / frxUSD / RLUSD / USDS if
  // borrowed on Aave or Spark.
  allowAction.cowswap.swap({
    sell: [frxUSD, GHO, RLUSD, USDC, USDG, USDS, USDT],
    buy: [frxUSD, GHO, RLUSD, USDC, USDG, USDS, USDT],
  }),

  // CowSwap - sell-only emergency exit for the loop collateral, for when Maple's
  // redemption queue is too slow: syrup tokens into the stablecoin each loop borrows.
  allowAction.cowswap.swap({
    sell: [syrupUSDC, syrupUSDG, syrupUSDT],
    buy: [USDC, USDG, USDT],
  }),

  // Morpho Market - Borrow USDC/syrupUSDC (91.5%) - syrupUSDC loop - id: 0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44",
    ],
  }),
  // Morpho Market - Borrow USDC/cbBTC (86%) - backup borrow venue for the BTC leg - id: 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64",
    ],
  }),
  // Morpho Market - Borrow USDT/syrupUSDT (91.5%) - syrupUSDT loop, as in the XAUt fund's leg 2 (#263) - id: 0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a
  allowAction.morphoMarkets.borrow({
    targets: [
      "0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a",
    ],
  }),
  // Morpho Market - Borrow USDT/cbBTC (86%) - backup borrow venue for the BTC leg - id: 0x4fe72543c5c95cd6b5f3cb516cd235ba882e2e705fe3424db6f99dfe5811d0d3
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x4fe72543c5c95cd6b5f3cb516cd235ba882e2e705fe3424db6f99dfe5811d0d3",
    ],
  }),

  // Morpho Vaults - the liquid sleeve: kpk USDC Yield v2, and kpk USDC / USDT Prime v2 as
  // more liquid alternatives
  allowAction.morphoVaults.deposit({
    targets: [
      morpho.kpkUsdcPrimeV2,
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdtPrimeV2,
    ],
  }),

  // Spark - backstop borrow venue at scale (USDS, then USDS -> USDC on CowSwap)
  allowAction.spark.borrow({ targets: ["USDC", "USDS", "USDT"] }),
  allowAction.spark.deposit({ targets: ["cbBTC"] }),
]
