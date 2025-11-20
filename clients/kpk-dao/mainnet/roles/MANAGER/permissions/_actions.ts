import { allow as allowAction } from "defi-kit/eth"
import {
  auraBAL,
  BAL,
  COMP,
  CRV,
  crvUSD,
  CVX,
  cvxCRV,
  DAI,
  eETH,
  ETHPlus,
  EURC,
  GEAR,
  GHO,
  KING,
  MORPHO,
  NOTE,
  RPL,
  rETH,
  sDAI,
  SPK,
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
  // Convex - GHO/cbBTC/WETH
  allowAction.convex.deposit({ targets: ["409"] }),
  // Convex - Stake cvxCRV
  allowAction.convex.stake({ targets: ["cvxCRV"] }),

  // CowSwap - [COMP, CRV, crvUSD, CVX, cvxCRV, DAI, eETH, ETH, ETH+, EURC, GEAR, GHO, KING, MORPHO, NOTE, RPL, rETH, sDAI, SPK, sUSDS, stETH, stkGHO, USDC, USDS, USDT, weETH, WETH, wstETH] ->
  // [DAI, eETH ETH, EURC, GHO, rETH, sDAI, sUSDS, stETH, stkGHO, USDC, USDS, USDT, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      COMP,
      CRV,
      crvUSD,
      CVX,
      cvxCRV,
      DAI,
      eETH,
      ETHPlus,
      EURC,
      GEAR,
      GHO,
      KING,
      MORPHO,
      NOTE,
      RPL,
      rETH,
      sDAI,
      SPK,
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
      EURC,
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

  // Fluid - Deposit wstETH
  allowAction.fluid.deposit({ targets: ["wstETH"] }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Vault - kpk ETH Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0xd564F765F9aD3E7d2d6cA782100795a885e8e7C8"],
  }),
  // Morpho Vault - kpk ETH v2
  allowAction.morphoVaults.deposit({
    targets: ["0xBb50A5341368751024ddf33385BA8cf61fE65FF9"],
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

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
]
