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
  // Aave v3 Core - backup borrow venue for the BTC leg, and the syrupUSDT loop (e-mode 33,
  // set through `setUserEMode` in calls.ts). cirBTC is scoped in calls.ts until defi-kit
  // lists it.
  allowAction.aave_v3.borrow({
    market: "Core",
    targets: ["GHO", "RLUSD", "USDC", "USDG", "USDT"],
  }),
  allowAction.aave_v3.deposit({
    market: "Core",
    targets: ["cbBTC", "syrupUSDT", "USDC", "USDG", "USDT", "WBTC"],
  }),

  // Compound v3 - lowest-priority backup borrow venue
  allowAction.compound_v3.borrow({ targets: ["USDC", "USDT"] }),
  allowAction.compound_v3.deposit({
    targets: ["cUSDCv3", "cUSDTv3"],
    tokens: ["cbBTC", "WBTC"],
  }),

  // CowSwap - the BTC set: WBTC / cbBTC / cirBTC between themselves and against USDC
  // (deposit-asset conversions, and selling collateral to repay in an emergency).
  allowAction.cowswap.swap({
    sell: [cbBTC, cirBTC, USDC, WBTC],
    buy: [cbBTC, cirBTC, USDC, WBTC],
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

  // Morpho Market - Borrow USDC/cbBTC (86%) - backup borrow venue for the BTC leg - id: 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64",
    ],
  }),
  // Morpho Market - Borrow USDC/syrupUSDC (91.5%) - syrupUSDC loop - id: 0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44",
    ],
  }),
  // Morpho Market - Borrow USDC/syrupUSDC (91.5%, second oracle) - syrupUSDC loop - id: 0x7ddde63e40deefdd5940120f58f88be7a4d11e709335a2024e3b616afbdf7120
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x7ddde63e40deefdd5940120f58f88be7a4d11e709335a2024e3b616afbdf7120",
    ],
  }),
  // Morpho Market - Borrow USDC/WBTC (86%) - backup borrow venue for the BTC leg - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49",
    ],
  }),
  // Morpho Market - Borrow USDT/cbBTC (86%) - backup borrow venue for the BTC leg - id: 0x4fe72543c5c95cd6b5f3cb516cd235ba882e2e705fe3424db6f99dfe5811d0d3
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x4fe72543c5c95cd6b5f3cb516cd235ba882e2e705fe3424db6f99dfe5811d0d3",
    ],
  }),
  // Morpho Market - Borrow USDT/syrupUSDT (91.5%) - syrupUSDT loop, as in the XAUt fund's leg 2 (#263) - id: 0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a
  allowAction.morphoMarkets.borrow({
    targets: [
      "0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a",
    ],
  }),
  // Morpho Market - Borrow USDT/WBTC (86%) - backup borrow venue for the BTC leg - id: 0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99
  allowAction.morphoMarkets.borrow({
    targets: [
      "0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99",
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
  allowAction.spark.deposit({ targets: ["cbBTC", "WBTC"] }),
]
