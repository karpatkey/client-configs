import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  ETHx,
  LDO,
  MORPHO,
  OETH,
  osETH,
  rETH,
  RPL,
  SPK,
  sUSDS,
  stETH,
  SWISE,
  USDC,
  USDS,
  USDT,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Ankr
  allowAction.ankr.deposit(),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Core Market - Deposit ETHx
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETHx"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),

  // Balancer v2 - wstETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer v2 - WETH/osETH
  allowAction.balancer_v2.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osETH/wETH-BPT"] }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  // Compound v3 - Deposit USDS
  allowAction.compound_v3.deposit({ targets: ["cUSDSv3"], tokens: ["USDS"] }),
  // Compound v3 - Deposit USDT
  allowAction.compound_v3.deposit({ targets: ["cUSDTv3"], tokens: ["USDT"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - ETH/OETH
  allowAction.convex.deposit({ targets: ["174"] }),
  // Convex - ETH/stETH - stETH-ng-f
  allowAction.convex.deposit({ targets: ["177"] }),
  // Convex - ETH/ETHx - ethx-f
  allowAction.convex.deposit({ targets: ["232"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),

  // CowSwap - [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH] ->
  // [DAI, rETH, USDC, USDT, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
    buy: [DAI, rETH, USDC, USDT, stETH, WETH, wstETH],
  }),

  // CowSwap - [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH] <->
  // [OETH, sUSDS, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
    buy: [OETH, sUSDS, USDS, USDT],
  }),
  allowAction.cowswap.swap({
    sell: [OETH, sUSDS, USDS, USDT],
    buy: [
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
  }),

  // CowSwap - [SPK] -> [DAI, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [SPK],
    buy: [DAI, USDC, USDS, USDT],
  }),

  // CowSwap - [MORPHO] -> [DAI, ETH, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [MORPHO],
    buy: ["ETH", DAI, USDC, USDS, USDT],
  }),

  // CowSwap - TWAP - [ETH, USDC, USDS, USDT] <-> [ETH, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: ["ETH", USDC, USDS, USDT],
    buy: ["ETH", USDC, USDS, USDT],
    twap: true,
    receiver: parameters.avatar,
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - Stake - Farm USDS
  allowAction.spark.stake(),
  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDS
  allowAction.spark.deposit({ targets: ["USDS"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit wstETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),

  // Stader
  allowAction.stader.deposit(),
]
