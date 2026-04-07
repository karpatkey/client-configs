import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  DAI,
  GHO,
  MORPHO,
  RLUSD,
  SPK,
  sUSDe,
  sUSDS,
  stkGHO,
  USDC,
  USDe,
  USDS,
  USDT,
  syrupUSDC,
} from "@/addresses/eth"

export default [
  // CowSwap - [AURA, BAL, DAI, GHO, MORPHO, RLUSD, SPK, sUSDe, sUSDS, stkGHO, syrupUSDC, USDC, USDe, USDS, USDT] <-> [USDC, USDT]
    allowAction.cowswap.swap({
      sell: [
        AURA,
        BAL,
        DAI,
        GHO,
        MORPHO,
        RLUSD,
        SPK,
        sUSDe,
        sUSDS,
        stkGHO,
        syrupUSDC,
        USDC,
        USDe,
        USDS,
        USDT,
      ],
      buy: [USDC, USDT],
    }),
]
