import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  aBAL,
  aEthBAL,
  aEthEURC,
  anyBAL,
  COMP,
  COW,
  DAI,
  EURA,
  EURC,
  FJO,
  GHO,
  GTC,
  GYD,
  MTA,
  OETH,
  rETH,
  sDAI,
  sUSDS,
  stEUR,
  stETH,
  stkAAVE,
  stkGHO,
  stUSR,
  sUSDe,
  SWISE,
  USDe,
  USDC,
  USR,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
  wstUSR,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave Safety Module - Stake AAVE and GHO
  allowAction.aave_v3.stake({ targets: ["AAVE", "GHO"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit WBTC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WBTC"] }),
  // Aave v3 Core Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),
  // Aave v3 Core Market - Borrow GHO
  allowAction.aave_v3.borrow({ market: "Core", targets: ["GHO"] }),

  // Balancer v2 - 80BAL20wETH/wETH
  allowAction.balancer_v2.deposit({ targets: ["80BAL20wETH/wETH"] }),
  // Balancer v2 - B-80BAL-20WETH
  allowAction.balancer_v2.deposit({ targets: ["B-80BAL-20WETH"] }),

  // Circle v2 - Receive USDC from Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  // Compound v3 - Deposit USDS
  allowAction.compound_v3.deposit({ targets: ["cUSDSv3"], tokens: ["USDS"] }),
  // Compound v3 - Deposit USDT
  allowAction.compound_v3.deposit({ targets: ["cUSDTv3"], tokens: ["USDT"] }),
  // Compound v3 - Deposit WETH
  allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["WETH"] }),

  // Convex - ETH/OETH
  allowAction.convex.deposit({ targets: ["174"] }),

  // CowSwap - [AAVE, COMP, COW, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH] ->
  // [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      AAVE,
      COMP,
      COW,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    buy: [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH],
    feeAmountBp: 200,
  }),

  // CowSwap - [aEthEURC, DAI, EURA, EURC, GHO, GYD, sDAI, stEUR, stUSR, sUSDe, USDe, USDC, USR, USDS, USDT, wstUSR] -> 
  // [aEthEURC, DAI, EURA, EURC, GHO, GYD, sDAI, stEUR, stUSR, sUSDe, sUSDS, USDe, USDC, USR, USDT, wstUSR]
  allowAction.cowswap.swap({
    sell: [aEthEURC, DAI, EURA, EURC, GHO, GYD, sDAI, stEUR, stUSR, sUSDe, USDe, USDC, USR, USDS, USDT, wstUSR],
    buy: [aEthEURC, DAI, EURA, EURC, GHO, GYD, sDAI, stEUR, stUSR, sUSDe, sUSDS, USDe, USDC, USR, USDT, wstUSR],
    feeAmountBp: 200,
  }),

  // CowSwap - GHO <-> stkGHO
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
    feeAmountBp: 200,
  }),

  // // CowSwap - USDS -> [DAI, sUSDS, USDC, USDT]
  // allowAction.cowswap.swap({
  //   sell: [USDS],
  //   buy: [DAI, sUSDS, USDC, USDT],
  //   feeAmountBp: 200,
  // }),

  // CowSwap - sUSDS -> [DAI, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [sUSDS],
    buy: [DAI, USDC, USDS, USDT],
    feeAmountBp: 200,
  }),

  // CowSwap - OETH -> [ETH, rETH, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [OETH],
    buy: ["ETH", rETH, stETH, WETH, wstETH],
    feeAmountBp: 200,
  }),

  // CowSwap - [FJO, GTC, MTA] -> [USDC, WETH]
  allowAction.cowswap.swap({
    sell: [FJO, GTC, MTA],
    buy: [USDC, WETH],
    feeAmountBp: 200,
  }),

  // CowSwap - [aBAL, aEthBAL, anyBAL, ETH, WETH] <-> [aBAL, aEthBAL, anyBAL, ETH, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", aBAL, aEthBAL, anyBAL, WETH],
    buy: ["ETH", aBAL, aEthBAL, anyBAL, WETH],
    feeAmountBp: 200,
  }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Vault - kpk ETH v2
  allowAction.morphoVaults.deposit({
    targets: ["0xBb50A5341368751024ddf33385BA8cf61fE65FF9"],
  }),
  // Morpho Vault - kpk EURC v2
  allowAction.morphoVaults.deposit({
    targets: ["0xa877D5bb0274dcCbA8556154A30E1Ca4021a275f"],
  }),
  // Morpho Vault - kpk USDC v2
  allowAction.morphoVaults.deposit({
    targets: ["0x4Ef53d2cAa51C447fdFEEedee8F07FD1962C9ee6"],
  }),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_spUSDC
  allowAction.spark.deposit({ targets: ["SKY_spUSDC"] }),
  // Spark - SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
  // Spark - SKY_spUSDT
  allowAction.spark.deposit({ targets: ["SKY_spUSDT"] }),

  // StakeWise v3 - Genesis Vault
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  // WARNING!: With the deposit action we are allowing to send ETH and the functions that involve ETH.
  // allowAction.uniswap_v3.deposit({ tokens: ["WBTC", "WETH"], fees: ["0.3%"] }),
  allowAction.uniswap_v3.deposit({ targets: ["430246"] }), // WARNING!: THIS MUST BE CHANGED BY THE PRECEDING CODE
]
