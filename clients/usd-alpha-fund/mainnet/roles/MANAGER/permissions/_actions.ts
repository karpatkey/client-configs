import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  AURA,
  BAL,
  COMP,
  CRV,
  crvUSD,
  CVX,
  DAI,
  GHO,
  GYD,
  NOTE,
  sDAI,
  sUSDe,
  stkGHO,
  USDC,
  USDe,
  USDM,
  USDS,
  USDT,
  wM,
} from "@/addresses/eth"
import { parameters } from "../../../instances/main"

export default [
  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  // Aave v3 Core Market - Deposit crvUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["crvUSD"] }),
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
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
  // Aave v3 Core Market - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Aura - GHO/USDC/USDT
  allowAction.aura.deposit({ targets: ["157"] }),

  // Balancer v2 - GHO/USDC/USDT
  allowAction.balancer_v2.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer_v2.stake({ targets: ["GHO/USDT/USDC"] }),

  // Convex - crvUSD/USDT
  allowAction.convex.deposit({ targets: ["179"] }),
  // Convex - crvUSD/USDc
  allowAction.convex.deposit({ targets: ["182"] }),

  // Circle v1 - Bridge USDC to Arbitrum
  allowAction.circle_v1.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Arbitrum
  allowAction.circle_v1.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Circle v1 - Bridge USDC to Base
  allowAction.circle_v1.bridge({
    targets: ["Base"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Base
  allowAction.circle_v1.receive({
    targets: ["Base"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Circle v1 - Bridge USDC to Optimism
  allowAction.circle_v1.bridge({
    targets: ["Optimism"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Optimism
  allowAction.circle_v1.receive({
    targets: ["Optimism"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),
  // CowSwap - [DAI, USDC, USDM] <-> [DAI, USDC, USDM]
  allowAction.cowswap.swap({ sell: [DAI, USDC, USDM], buy: [DAI, USDC, USDM] }),
  // CowSwap - [USDC, wM] <-> [USDC, wM]
  allowAction.cowswap.swap({ sell: [USDC, wM], buy: [USDC, wM] }),
  // CowSwap - [AAVE, AURA, BAL, CRV, crvUSD, CVX, DAI, GHO, GYD, NOTE, sDAI, stkGHO, sUSDe, USDC, USDe, USDS, USDT] <->
  // [AAVE, AURA, BAL, CRV, crvUSD, CVX, DAI, GHO, GYD, NOTE, sDAI, stkGHO, sUSDe, USDC, USDe, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [
      AAVE,
      AURA,
      BAL,
      CRV,
      crvUSD,
      CVX,
      DAI,
      GHO,
      GYD,
      NOTE,
      sDAI,
      stkGHO,
      sUSDe,
      USDC,
      USDe,
      USDS,
      USDT,
    ],
    buy: [
      AAVE,
      AURA,
      BAL,
      CRV,
      crvUSD,
      CVX,
      DAI,
      GHO,
      GYD,
      NOTE,
      sDAI,
      stkGHO,
      sUSDe,
      USDC,
      USDe,
      USDS,
      USDT,
    ],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - Borrow DAI
  allowAction.spark.borrow({ targets: ["DAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),
]
