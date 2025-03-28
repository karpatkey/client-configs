import { allow as allowAction } from "defi-kit/eth"
import { CRV, COMP, CVX, DAI, NOTE, USDC, USDT, WETH } from "@/addresses/eth"

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

  // Convex - USDT/WBTC/WETH
  allowAction.convex.deposit({ targets: ["188"] }),
  // Convex - GHO/WBTC/wstETH
  allowAction.convex.deposit({ targets: ["297"] }),

  // CowSwap - [DAI, USDC, USDT] -> [DAI, USDC, USDT, WETH]
  allowAction.cowswap.swap({
    sell: [DAI, USDC, USDT],
    buy: [DAI, USDC, USDT, WETH],
  }),
  // CowSwap - [CRV, COMP, CVX, NOTE] -> [DAI, USDC]
  allowAction.cowswap.swap({ sell: [CRV, COMP, CVX, NOTE], buy: [DAI, USDC] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
]
