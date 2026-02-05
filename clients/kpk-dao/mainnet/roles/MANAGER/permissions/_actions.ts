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
  GNO,
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
  gearbox,
  morpho,
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

  // CowSwap - [COMP, CRV, crvUSD, CVX, cvxCRV, DAI, eETH, ETH, ETH+, EURC, GEAR, GHO, GNO, KING, MORPHO, NOTE, RPL, rETH, sDAI, SPK, sUSDS, stETH, stkGHO, USDC, USDS, USDT, weETH, WETH, wstETH] ->
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
      GNO,
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

  // Gearbox - ETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWeth],
  }),
  // Gearbox - wstETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWstEth],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Vault - kpk ETH Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV1],
  }),
  // Morpho Vault - kpk ETH Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV2],
  }),
  // Morpho Vault - kpk ETH Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthYieldV1],
  }),
  // Morpho Vault - kpk ETH Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthYieldV2],
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

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
]
