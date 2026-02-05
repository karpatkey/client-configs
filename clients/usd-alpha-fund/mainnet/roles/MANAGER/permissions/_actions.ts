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
  morpho,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit RLUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["RLUSD"] }),
  // Aave v3 Core Market - Deposit sUSDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sUSDe"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Morpho Market - USDC/wstETH - id: 0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc",
    ],
  }),
  // Morpho Market - USDC/WBTC - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49",
    ],
  }),
  // Morpho Market - USDT/sUSDS - id: 0x3274643db77a064abd3bc851de77556a4ad2e2f502f4f0c80845fa8f909ecf0b
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x3274643db77a064abd3bc851de77556a4ad2e2f502f4f0c80845fa8f909ecf0b",
    ],
  }),
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x3274643db77a064abd3bc851de77556a4ad2e2f502f4f0c80845fa8f909ecf0b",
    ],
  }),
  // Morpho Market - USDC/cbBTC - id: 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64",
    ],
  }),
  // Morpho Market - USDC/PT-USDe-25SEP2025 - id: 0x7a5d67805cb78fad2596899e0c83719ba89df353b931582eb7d3041fd5a06dc8
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x7a5d67805cb78fad2596899e0c83719ba89df353b931582eb7d3041fd5a06dc8",
    ],
  }),
  // Morpho Market - USDT/PT-USDe-25SEP2025 - id: 0xb0a9ac81a8c6a5274aa1a8337aed35a2cb2cd4feb5c6d3b39d41f234fbf2955b
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xb0a9ac81a8c6a5274aa1a8337aed35a2cb2cd4feb5c6d3b39d41f234fbf2955b",
    ],
  }),
  // Morpho Market - USDC/wstUSR - id: 0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc",
    ],
  }),
  // Morpho Market - USDC/RLP - id: 0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33",
    ],
  }),
  // Morpho Market - USDC/syrupUSDC - id: 0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44",
    ],
  }),
  // Morpho Market - USDC/ETH+ - id: 0xdb8938f97571aeab0deb0c34cf7e6278cff969538f49eebe6f4fc75a9a111293
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xdb8938f97571aeab0deb0c34cf7e6278cff969538f49eebe6f4fc75a9a111293",
    ],
  }),
  // Morpho Market - USDC/PT-sUSDE-27NOV2025 - id: 0x05702edf1c4709808b62fe65a7d082dccc9386f858ae460ef207ec8dd1debfa2
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x05702edf1c4709808b62fe65a7d082dccc9386f858ae460ef207ec8dd1debfa2",
    ],
  }),
  // Morpho Market - USDC/PT-USDe-27NOV2025 - id: 0x534e7046c3aebaa0c6c363cdbeb9392fc87af71cc16862479403a198fe04b206
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x534e7046c3aebaa0c6c363cdbeb9392fc87af71cc16862479403a198fe04b206",
    ],
  }),

  // Morpho Vault - kpk USDC Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV1],
  }),
  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV2],
  }),

  // Spark - Deposit USDS to get sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
  // Spark - Deposit sUSDS
  allowAction.spark.deposit({ targets: ["sUSDS"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [AURA, BAL, DAI, GHO, MORPHO, RLUSD, SPK, sUSDe, sUSDS, stkGHO, syrupUSDC, USDC, USDe, USDS, USDT] <->
  // [GHO, RLUSD, sUSDe, sUSDS, stkGHO, syrupUSDC, USDC, USDe, USDS, USDT]
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
    buy: [GHO, RLUSD, sUSDe, sUSDS, stkGHO, syrupUSDC, USDC, USDe, USDS, USDT],
  }),

  /*********************************************
   * Bridges
   *********************************************/

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
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Base
  allowAction.circle_v2.receive({
    targets: ["Base"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
  // Circle v2 - Bridge USDC to Optimism
  allowAction.circle_v2.bridge({
    targets: ["Optimism"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Optimism
  allowAction.circle_v2.receive({
    targets: ["Optimism"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
]
