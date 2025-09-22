import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  DAI,
  GHO,
  MORPHO,
  SPK,
  sUSDe,
  sUSDS,
  stkGHO,
  USDC,
  USDe,
  USDS,
  USDT,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave Safety Module - Stake GHO
  allowAction.aave_v2.stake({ targets: ["GHO"] }),
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

  // Spark - Deposit USDS to get sUSDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
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

  // CowSwap - [AURA, BAL, DAI, GHO, MORPHO, SPK, sUSDe, sUSDS, stkGHO, USDC, USDe, USDS, USDT] <-> [GHO, sUSDe, sUSDS, stkGHO, USDC, USDe, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [
      AURA,
      BAL,
      DAI,
      GHO,
      MORPHO,
      SPK,
      sUSDe,
      sUSDS,
      stkGHO,
      USDC,
      USDe,
      USDS,
      USDT,
    ],
    buy: [GHO, sUSDe, sUSDS, stkGHO, USDC, USDe, USDS, USDT],
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
