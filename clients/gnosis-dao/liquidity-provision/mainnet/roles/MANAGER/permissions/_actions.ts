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

  // CowSwap - [ETH, ETHx, WETH] <-> [ETH, ETHx, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", ETHx, WETH],
    buy: ["ETH", ETHx, WETH],
  }),
  // CowSwap - WETH <-> ezETH
  allowAction.cowswap.swap({
    sell: [WETH, ezETH],
    buy: [WETH, ezETH],
  }),
  // CowSwap - WETH <-> OETH
  allowAction.cowswap.swap({
    sell: [WETH, OETH],
    buy: [WETH, OETH],
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
  // CowSwap - wstETH <-> ETHx
  allowAction.cowswap.swap({
    sell: [wstETH, ETHx],
    buy: [wstETH, ETHx],
  }),
  // CowSwap - wstETH <-> ezETH
  allowAction.cowswap.swap({
    sell: [wstETH, ezETH],
    buy: [wstETH, ezETH],
  }),
  // CowSwap - wstETH <-> OETH
  allowAction.cowswap.swap({
    sell: [wstETH, OETH],
    buy: [wstETH, OETH],
  }),
  // CowSwap - wstETH <-> osETH
  allowAction.cowswap.swap({
    sell: [wstETH, osETH],
    buy: [wstETH, osETH],
  }),
  // CowSwap - wstETH <-> rsETH
  allowAction.cowswap.swap({
    sell: [wstETH, rsETH],
    buy: [wstETH, rsETH],
  }),
  // CowSwap - wstETH <-> stETH
  allowAction.cowswap.swap({
    sell: [wstETH, stETH],
    buy: [wstETH, stETH],
  }),
  // CowSwap - wstETH <-> weETH
  allowAction.cowswap.swap({
    sell: [wstETH, weETH],
    buy: [wstETH, weETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One - MEV Max
  allowAction.stakewise_v3.stake({ targets: ["Chorus One - MEV Max"] }),
  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),
  // StakeWise v3 - NodeSet Private Vault
  allowAction.stakewise_v3.stake({ targets: ["NodeSet Private Vault"] }),
  // StakeWise v3 - Serenita - Powered by Vero
  allowAction.stakewise_v3.stake({ targets: ["Serenita - Powered by Vero"] }),
  // StakeWise v3 - Stakeway Private Vault 1
  allowAction.stakewise_v3.stake({ targets: ["Stakeway Private Vault 1"] }),

  // Uniswap v3 - ETHx + wstETH
  allowAction.uniswap_v3.deposit({
    tokens: ["ETHx", "wstETH"],
  }),
  // Uniswap v3 - rsETH + wstETH
  allowAction.uniswap_v3.deposit({
    tokens: ["rsETH", "wstETH"],
  }),
]
