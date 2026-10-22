import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  DAI,
  EURC,
  EURe,
  frxUSD,
  GHO,
  MORPHO,
  sGHO,
  sUSDS,
  USDC,
  USDG,
  USDS,
  USDT,
  morpho,
} from "@/addresses/eth"
import { kpkFoundationBase } from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 - Deposit USDC (includes claiming incentives)
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  // Circle v2 - Bridge USDC to Arbitrum
  allowAction.circle_v2.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
  // Circle v2 - Bridge USDC to Base
  allowAction.circle_v2.bridge({
    targets: ["Base"],
    recipient: kpkFoundationBase,
  }),
  // Circle v2 - Receive USDC from Base
  allowAction.circle_v2.receive({
    targets: ["Base"],
    sender: kpkFoundationBase,
    recipient: parameters.avatar,
  }),

  // Compound v3 - Deposit USDC (includes claiming rewards)
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),

  // CowSwap - [COMP, DAI, EURC, EURe, frxUSD, GHO, MORPHO, sGHO, sUSDS, USDC, USDG, USDS, USDT] ->
  // [DAI, EURC, EURe, frxUSD, GHO, sGHO, sUSDS, USDC, USDG, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [
      COMP,
      DAI,
      EURC,
      EURe,
      frxUSD,
      GHO,
      MORPHO,
      sGHO,
      sUSDS,
      USDC,
      USDG,
      USDS,
      USDT,
    ],
    buy: [DAI, EURC, EURe, frxUSD, GHO, sGHO, sUSDS, USDC, USDG, USDS, USDT],
  }),

  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),

  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV2],
  }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV2],
  }),
  // Morpho Vault - kpk USDC Yield RWA
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldRWA],
  }),
  // Morpho Vault - kpk USDC Prime Core
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeCore],
  }),
  // Morpho Vault - kpk EURC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEurcYieldV2],
  }),
  // Morpho Vault - kpk USDT Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdtPrimeV2],
  }),

  // Sky / Spark - Deposit SKY_sUSDS (also covers USDC <-> USDS and DAI <-> USDS)
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
]
