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
  morpho,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 - Deposit USDC
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

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),

  // CowSwap - [COMP, DAI, EURC, MORPHO, sDAI, sUSDS, USDC, USDS, USDT] -> [DAI, EURC, sDAI, sUSDS, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, EURC, MORPHO, sDAI, sUSDS, USDC, USDS, USDT],
    buy: [DAI, EURC, sDAI, sUSDS, USDC, USDS, USDT],
  }),

  // Morpho Vault - kpk EURC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEurcYieldV1],
  }),
  // Morpho Vault - kpk EURC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEurcYieldV2],
  }),
  // Morpho Vault - kpk USDC Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV1],
  }),
  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV2],
  }),
  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV1],
  }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV2],
  }),

  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
]
