import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  ETHx,
  GHO,
  osETH,
  rETH,
  RLUSD,
  rsETH,
  stETH,
  USDC,
  USDe,
  USDS,
  USDT,
  USR,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Aave v3 - Deposit ETHx
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETHx"] }),
  // Aave v3 - Deposit ezETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ezETH"] }),
  // Aave v3 - Deposit RLUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["RLUSD"] }),
  // Aave v3 - Deposit rsETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rsETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 - Deposit weETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["weETH"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),
  // Aave v3 - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ market: "Core", targets: ["GHO"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),
  // Aave v3 - Borrow USDS
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDS"] }),
  // Aave v3 - Borrow USDT
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDT"] }),
  // Aave v3 - Borrow WBTC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["WBTC"] }),

  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer - Lock
  allowAction.balancer_v2.lock(),

  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({
    sell: [DAI, USDC],
    buy: [DAI, USDC],
  }),
  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({
    sell: [DAI, USDT],
    buy: [DAI, USDT],
  }),
  // CowSwap - GHO <-> USDC
  allowAction.cowswap.swap({
    sell: [GHO, USDC],
    buy: [GHO, USDC],
  }),
  // CowSwap - USDC <-> RLUSD
  allowAction.cowswap.swap({
    sell: [USDC, RLUSD],
    buy: [USDC, RLUSD],
  }),
  // CowSwap - USDC <-> USDe
  allowAction.cowswap.swap({
    sell: [USDC, USDe],
    buy: [USDC, USDe],
  }),
  // CowSwap - USDC <-> USDS
  allowAction.cowswap.swap({
    sell: [USDC, USDS],
    buy: [USDC, USDS],
  }),
  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
  // CowSwap - USDC <-> USR
  allowAction.cowswap.swap({
    sell: [USDC, USR],
    buy: [USDC, USR],
  }),

  // CowSwap - USDC <-> WETH
  allowAction.cowswap.swap({
    sell: [USDC, WETH],
    buy: [USDC, WETH],
  }),
  // CowSwap - USDC <-> wstETH
  allowAction.cowswap.swap({
    sell: [USDC, wstETH],
    buy: [USDC, wstETH],
  }),

  // CowSwap - [ETH, ETHx, WETH] <-> [ETH, ETHx, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", ETHx, WETH],
    buy: ["ETH", ETHx, WETH],
  }),
  // CowSwap - WETH <-> osETH
  allowAction.cowswap.swap({
    sell: [WETH, osETH],
    buy: [WETH, osETH],
  }),
  // CowSwap - WETH <-> rETH
  allowAction.cowswap.swap({
    sell: [WETH, rETH],
    buy: [WETH, rETH],
  }),
  // CowSwap - WETH <-> rsETH
  allowAction.cowswap.swap({
    sell: [WETH, rsETH],
    buy: [WETH, rsETH],
  }),
  // CowSwap - WETH <-> weETH
  allowAction.cowswap.swap({
    sell: [WETH, weETH],
    buy: [WETH, weETH],
  }),
  // CowSwap - WETH <-> wstETH
  allowAction.cowswap.swap({
    sell: [WETH, wstETH],
    buy: [WETH, wstETH],
  }),
  // CowSwap - wstETH -> stETH
  allowAction.cowswap.swap({
    sell: [wstETH],
    buy: [stETH],
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit sUSDS
  allowAction.fluid.deposit({ targets: ["sUSDS"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit wstETH
  allowAction.fluid.deposit({ targets: ["wstETH"] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One - MEV Max
  allowAction.stakewise_v3.stake({ targets: ["Chorus One - MEV Max"] }),
]
