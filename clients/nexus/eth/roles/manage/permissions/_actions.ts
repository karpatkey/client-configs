import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  AURA,
  BAL,
  cbBTC,
  CRV,
  CVX,
  DAI,
  eETH,
  GHO,
  LDO,
  osETH,
  rETH,
  RPL,
  sUSDS,
  stETH,
  SWISE,
  USDC,
  USDS,
  USDT,
  weETH,
  WETH,
  wNXM,
  wstETH,
} from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit rETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rETH"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 Core Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),

  // Aave v3 Prime Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["ETH"] }),
  // Aave v3 Prime Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["USDC"] }),
  // Aave v3 Prime Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["WETH"] }),
  // Aave v3 Prime Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["wstETH"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - GHO/USDT/USDC
  allowAction.aura.deposit({ targets: ["157"] }),
  // Aura - sDAI/3Pool
  allowAction.aura.deposit({ targets: ["186"] }),
  // Aura - Gyroscope ECLP GHO/USDC 2
  allowAction.aura.deposit({ targets: ["195"] }),
  // Aura - weETH/rETH
  allowAction.aura.deposit({ targets: ["182"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - osETH/WETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - GHO/USDT/USDC
  allowAction.balancer.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer.stake({ targets: ["GHO/USDT/USDC"] }),
  // Balancer - sDAI/3Pool
  allowAction.balancer.deposit({ targets: ["sDAI/3Pool"] }),
  allowAction.balancer.stake({ targets: ["sDAI/3Pool"] }),
  // Balancer - Gyroscope ECLP GHO/USDC 2
  allowAction.balancer.deposit({ targets: ["ECLP-GHO-USDC-2"] }),
  allowAction.balancer.stake({ targets: ["ECLP-GHO-USDC-2"] }),
  // Balancer - weETH/rETH
  allowAction.balancer.deposit({ targets: ["weETH/rETH"] }),
  allowAction.balancer.stake({ targets: ["weETH/rETH"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),

  // CowSwap - [AAVE, AURA, BAL, CRV, CVX, DAI, ETH, GHO, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wNXM, wstETH] ->
  // [DAI, ETH, GHO, osETH, rETH, stETH, USDC, USDT, WETH, wNXM, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      AAVE,
      AURA,
      BAL,
      CRV,
      CVX,
      DAI,
      GHO,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wNXM,
      wstETH,
    ],
    buy: ["ETH", DAI, GHO, osETH, rETH, stETH, USDC, USDT, WETH, wNXM, wstETH],
  }),

  // CowSwap - [USDS] <-> [ETH, sUSDS, USDC, WETH, wNXM, wstETH]
  allowAction.cowswap.swap({
    sell: [USDS],
    buy: ["ETH", sUSDS, USDC, WETH, wNXM, wstETH],
  }),
  allowAction.cowswap.swap({
    sell: ["ETH", sUSDS, USDC, WETH, wNXM, wstETH],
    buy: [USDS],
  }),

  // CowSwap - [eETH, weETH] <-> [ETH, eETH, rETH, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [eETH, weETH],
    buy: ["ETH", eETH, rETH, stETH, WETH, wstETH],
  }),
  allowAction.cowswap.swap({
    sell: ["ETH", eETH, rETH, stETH, WETH, wstETH],
    buy: [eETH, weETH],
  }),

  // CowSwap - [cbBTC] -> [USDC, USDT, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [cbBTC],
    buy: [USDC, USDT, WETH, wstETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - Deposit rETH
  allowAction.spark.deposit({ targets: ["rETH"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit wstETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // Uniswap v3 - wNXN/WETH
  allowAction.uniswap_v3.deposit({ tokens: ["wNXM", "WETH"] }),
]
