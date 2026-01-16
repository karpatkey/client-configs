import { allow as allowAction } from "defi-kit/eth"
import {
  BAL,
  DAI,
  ETHx,
  ezETH,
  GHO,
  KERNEL,
  KING,
  MORPHO,
  OETH,
  osETH,
  RESOLV,
  rETH,
  RLUSD,
  rsETH,
  SD,
  stETH,
  SWISE,
  USDC,
  USDe,
  USDS,
  USDT,
  USR,
  WBTC,
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

  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer v2 - pxETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["pxETH/wETH"] }),
  allowAction.balancer_v2.stake({ targets: ["pxETH/wETH"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - Lock
  allowAction.balancer_v2.lock(),

  // CowSwap - [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR] <-> [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR]
  allowAction.cowswap.swap({
    sell: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
    buy: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
  }),

  // CowSwap - [BAL, KERNEL, KING, MORPHO, RESOLV, SD, SWISE] -> [USDC]
  allowAction.cowswap.swap({
    sell: [BAL, KERNEL, KING, MORPHO, RESOLV, SD, SWISE],
    buy: [USDC],
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

  // CowSwap - WBTC <-> WETH
  allowAction.cowswap.swap({
    sell: [WBTC, WETH],
    buy: [WBTC, WETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One Max Vault
  allowAction.stakewise_v3.stake({ targets: ["Chorus One Max Vault"] }),
  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),
  // StakeWise v3 - NodeSet Private Vault
  allowAction.stakewise_v3.stake({ targets: ["NodeSet Private Vault"] }),
  // StakeWise v3 - Serenita - Powered by Vero
  allowAction.stakewise_v3.stake({ targets: ["Serenita - Powered by Vero"] }),

  // Uniswap v3 - ETHx + wstETH
  allowAction.uniswap_v3.deposit({
    tokens: ["ETHx", "wstETH"],
  }),
  // Uniswap v3 - rsETH + wstETH
  allowAction.uniswap_v3.deposit({
    tokens: ["rsETH", "wstETH"],
  }),
  // Uniswap v3 - WBTC + WETH
  allowAction.uniswap_v3.deposit({
    tokens: ["WBTC", "WETH"],
  }),
]
