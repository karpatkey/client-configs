import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  ETHx,
  GHO,
  osETH,
  rETH,
  stETH,
  USDC,
  USDT,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

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

  // Ankr
  allowAction.ankr.deposit(),

  // Aura - auraBAL
  allowAction.aura.deposit({ targets: ["101"] }),
  // Aura - COW/GNO
  allowAction.aura.deposit({ targets: ["104"] }),
  // Aura - COW/WETH
  allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer v2 - auraBAL
  allowAction.balancer_v2.deposit({ targets: ["B-auraBAL-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-auraBAL-STABLE"] }),
  // Balancer v2 - COW/GNO
  allowAction.balancer_v2.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["50COW-50GNO"] }),
  // Balancer v2 - COW/WETH
  allowAction.balancer_v2.deposit({ targets: ["50COW-50WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["50COW-50WETH"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - Lock
  allowAction.balancer_v2.lock(),

  // Convex - Lock
  allowAction.convex.lock(),

  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({
    sell: [DAI, USDT],
    buy: [DAI, USDT],
  }),
  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({
    sell: [DAI, USDC],
    buy: [DAI, USDC],
  }),
  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
  // CowSwap - wstETH -> stETH
  allowAction.cowswap.swap({
    sell: [wstETH],
    buy: [stETH],
  }),
  // CowSwap - osETH <-> WETH
  allowAction.cowswap.swap({
    sell: [osETH, WETH],
    buy: [osETH, WETH],
  }),
  // CowSwap - rETH <-> WETH
  allowAction.cowswap.swap({
    sell: [rETH, WETH],
    buy: [rETH, WETH],
  }),
  // CowSwap - GHO <-> USDC
  allowAction.cowswap.swap({
    sell: [GHO, USDC],
    buy: [GHO, USDC],
  }),
  // CowSwap - ETH <-> ETHx
  allowAction.cowswap.swap({
    sell: ["ETH", ETHx],
    buy: ["ETH", ETHx],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One - MEV Max
  allowAction.stakewise_v3.stake({ targets: ["Chorus One - MEV Max"] }),
]
