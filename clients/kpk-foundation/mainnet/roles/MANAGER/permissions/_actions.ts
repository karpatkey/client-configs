import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  DAI,
  EURC,
  MORPHO,
  sDAI,
  sUSDS,
  USDC,
  USDS,
  USDT,
} from "@/addresses/eth"

export default [
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),

  // CowSwap - [COMP, DAI, EURC, MORPHO, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, EURC, sDAI, sUSDS, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, EURC, MORPHO, sDAI, sUSDS, USDC, USDS, USDT],
    buy: [DAI, EURC, sDAI, sUSDS, USDC, USDS, USDT],
  }),

  // Morpho Vault - kpk EURC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0x0c6aec603d48eBf1cECc7b247a2c3DA08b398DC1"],
  }),
  // Morpho Vault - kpk EURC v2
  allowAction.morphoVaults.deposit({
    targets: ["0xa877D5bb0274dcCbA8556154A30E1Ca4021a275f"],
  }),
  // Morpho Vault - kpk USDC Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0xe108fbc04852B5df72f9E44d7C29F47e7A993aDd"],
  }),
  // Morpho Vault - kpk USDC v2
  allowAction.morphoVaults.deposit({
    targets: ["0x4Ef53d2cAa51C447fdFEEedee8F07FD1962C9ee6"],
  }),

  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
]
