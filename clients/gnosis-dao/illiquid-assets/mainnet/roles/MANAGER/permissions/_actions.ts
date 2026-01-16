import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  ETHx,
  ezETH,
  GHO,
  OETH,
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

  // Aura - auraBAL
  allowAction.aura.deposit({ targets: ["101"] }),
  // Aura - COW/GNO
  allowAction.aura.deposit({ targets: ["104"] }),
  // Aura - COW/WETH
  allowAction.aura.deposit({ targets: ["105"] }),
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
  // Balancer - Lock
  allowAction.balancer_v2.lock(),

  // CowSwap - [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR] <-> [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR]
  allowAction.cowswap.swap({
    sell: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
    buy: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
  }),

  // CowSwap - [ETH, ETHx, ezETH, OETH, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH] <-> [ETH, ETHx, ezETH, OETH, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      ETHx,
      ezETH,
      OETH,
      osETH,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      "ETH",
      ETHx,
      ezETH,
      OETH,
      osETH,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One Max Vault
  allowAction.stakewise_v3.stake({ targets: ["Chorus One Max Vault"] }),
]
