import { allow as allowAction } from "defi-kit/eth"
import {
  auraBAL,
  BAL,
  CRV,
  crvUSD,
  COMP,
  CVX,
  DAI,
  eETH,
  GHO,
  NOTE,
  RPL,
  rETH,
  sDAI,
  stETH,
  stkGHO,
  sUSDS,
  USDC,
  USDS,
  USDT,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  // Aave Safety Module - Stake AAVE and GHO
  allowAction.aave_v3.stake({ targets: ["AAVE", "GHO"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),

  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer v2 - wstETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["wstETH-WETH-BPT"] }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),

  // Convex - USDT/WBTC/WETH
  allowAction.convex.deposit({ targets: ["188"] }),
  // Convex - GHO/WBTC/wstETH
  allowAction.convex.deposit({ targets: ["297"] }),
  // Convex - GHO/cbBTC/WETH
  allowAction.convex.deposit({ targets: ["409"] }),

  // CowSwap - [COMP, CRV, crvUSD, CVX, DAI, eETH, ETH, GHO, NOTE, RPL, rETH, sDAI, sUSDS, stETH, stkGHO, USDC, USDS, USDT, weETH, WETH, wstETH] ->
  // [DAI, eETH, ETH, GHO, rETH, sDAI, sUSDS, stETH, stkGHO, USDC, USDS, USDT, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      COMP,
      CRV,
      crvUSD,
      CVX,
      DAI,
      eETH,
      GHO,
      NOTE,
      RPL,
      rETH,
      sDAI,
      sUSDS,
      stETH,
      stkGHO,
      USDC,
      USDS,
      USDT,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      "ETH",
      DAI,
      eETH,
      GHO,
      rETH,
      sDAI,
      sUSDS,
      stETH,
      stkGHO,
      USDC,
      USDS,
      USDT,
      weETH,
      WETH,
      wstETH,
    ],
  }),
  // CowSwap - BAL -> auraBAL
  allowAction.cowswap.swap({
    sell: [BAL],
    buy: [auraBAL],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
]
