import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  COMP,
  DAI,
  FJO,
  GHO,
  GTC,
  GYD,
  MTA,
  OETH,
  rETH,
  sDAI,
  sUSDS,
  stETH,
  stkAAVE,
  stkGHO,
  SWISE,
  USDC,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { kpkGovernance } from "../../../addresses"
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

  // Aave - Delegate AAVE and stkAAVE to governance.karpatkey.eth
  // WARNING!: The delegate action allows delegate() and delegateByType(), the latter is not part of the orginal preset
  allowAction.aave_v3.delegate({
    targets: ["AAVE", "stkAAVE"],
    delegatee: kpkGovernance,
  }),

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

  // Convex - ETH/OETH
  allowAction.convex.deposit({ targets: ["174"] }),

  // CowSwap - [AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH] ->
  // [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      AAVE,
      COMP,
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

  // CowSwap - [DAI, GHO, GYD, sDAI, USDC, USDT] <-> [DAI, GHO, GYD, sDAI, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [DAI, GHO, GYD, sDAI, USDC, USDT],
    buy: [DAI, GHO, GYD, sDAI, USDC, USDT],
    feeAmountBp: 200,
  }),

  // CowSwap - GHO <-> stkGHO
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
    feeAmountBp: 200,
  }),

  // CowSwap - USDS -> [DAI, sUSDS, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [USDS],
    buy: [DAI, sUSDS, USDC, USDT],
    feeAmountBp: 200,
  }),

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

  // CowSwap - [FJO, GTC, MTA] -> USDC
  allowAction.cowswap.swap({
    sell: [FJO, GTC, MTA],
    buy: [USDC],
    feeAmountBp: 200,
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  // StakeWise v3 - Genesis Vault
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  // WARNING!: With the deposit action we are allowing to send ETH and the functions that involve ETH.
  // allowAction.uniswap_v3.deposit({ tokens: ["WBTC", "WETH"], fees: ["0.3%"] }),
  allowAction.uniswap_v3.deposit({ targets: ["430246"] }), // WARNING!: THIS MUST BE CHANGED BY THE PRECEDING CODE
]
