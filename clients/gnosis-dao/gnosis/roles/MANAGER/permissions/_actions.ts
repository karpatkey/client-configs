import { allow as allowAction } from "defi-kit/gno"
import {
  EURe,
  GNO,
  sDAI,
  USDC,
  USDCe,
  USDT,
  wstETH,
  WXDAI,
} from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit EURe
  allowAction.aave_v3.deposit({ targets: ["EURe"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),

  // Aura - WETH/wstETH
  allowAction.aura.deposit({ targets: ["0"] }),
  // Aura - EURe/sDAI
  allowAction.aura.deposit({ targets: ["18"] }),
  // Aura - Gyroscope ECLP rETH/WETH
  allowAction.aura.deposit({ targets: ["26"] }),

  // Balancer v2 - wstETH/GNO
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-50GNO"] }),
  // Balancer v2 - sDAI/wstETH
  allowAction.balancer_v2.deposit({ targets: ["B-50sDAI-50wstETH"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50sDAI-50wstETH"] }),
  // Balancer v2 - USDC.e/USDT/sDAI
  allowAction.balancer_v2.deposit({ targets: ["sBAL3"] }),
  allowAction.balancer_v2.stake({ targets: ["sBAL3"] }),
  // Balancer v2 - WETH/wstETH
  allowAction.balancer_v2.deposit({ targets: ["bb-WETH-wstETH"] }),
  allowAction.balancer_v2.stake({ targets: ["bb-WETH-wstETH"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["ECLP-rETH-WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["ECLP-rETH-WETH"] }),
  // Balancer v2 - osGNO/GNO
  allowAction.balancer_v2.deposit({ targets: ["osGNO/GNO-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osGNO/GNO-BPT"] }),
  // Balancer v2 - WBTC/WETH
  allowAction.balancer_v2.deposit({ targets: ["50WBTC-50WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["50WBTC-50WETH"] }),
  // Balancer v2 - Gyroscope ECLP wstETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["ECLP-wstETH-WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["ECLP-wstETH-WETH"] }),
  // Balancer v2 - wstETH/BAL/AURA
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  // Balancer v2 - wstETH/COW
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-50COW"] }),
  // Balancer v2 - COW/GNO
  allowAction.balancer_v2.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["50COW-50GNO"] }),
  // Balancer v2 - stEUR/EURe
  allowAction.balancer_v2.deposit({ targets: ["stEUR/EURe"] }),
  allowAction.balancer_v2.stake({ targets: ["stEUR/EURe"] }),
  // Balancer v2 - GIV/GNO
  allowAction.balancer_v2.deposit({ targets: ["50GIV-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["50GIV-50GNO"] }),
  // Balancer v2 - WXDAI/GNO
  allowAction.balancer_v2.deposit({ targets: ["WXDAI-GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["WXDAI-GNO"] }),
  // Balancer v2 - EURe/sDAI
  allowAction.balancer_v2.deposit({ targets: ["EURe/sDAI"] }),
  allowAction.balancer_v2.stake({ targets: ["EURe/sDAI"] }),
  // Balancer v2 - WBTC/WSTETH
  allowAction.balancer_v2.deposit({ targets: ["50WBTC/50WSTETH"] }),
  allowAction.balancer_v2.stake({ targets: ["50WBTC/50WSTETH"] }),

  // CowSwap - XDAI -> [EURe, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: ["XDAI"],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - [EURe, USDC.e, USDT] -> XDAI
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: ["XDAI"],
  }),

  // CowSwap - WXDAI -> [EURe, USDC.e, USDT]
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - [EURe, USDC.e, USDT] -> WXDAI
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: [WXDAI],
  }),

  // CowSwap - USDC.e <-> USDT
  allowAction.cowswap.swap({
    sell: [USDCe, USDT],
    buy: [USDCe, USDT],
  }),

  // CowSwap - USDC <-> USDC.e
  allowAction.cowswap.swap({
    sell: [USDC, USDCe],
    buy: [USDC, USDCe],
  }),

  // CowSwap - EURe <-> USDC.e
  allowAction.cowswap.swap({
    sell: [EURe, USDCe],
    buy: [EURe, USDCe],
  }),

  // CowSwap - EURe <-> USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDT],
    buy: [EURe, USDT],
  }),

  // Spark - Deposit EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - Deposit GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // StakeWise v3 - Axol.io
  allowAction.stakewise_v3.stake({ targets: ["Axol.io"] }),
  // StakeWise v3 - H2O Nodes
  allowAction.stakewise_v3.stake({ targets: ["H2O Nodes"] }),
  // StakeWise v3 - IP Stake
  allowAction.stakewise_v3.stake({ targets: ["IP Stake"] }),
  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - Stakecat
  allowAction.stakewise_v3.stake({ targets: ["Stakecat"] }),
  // StakeWise v3 - Stakesaurus SEA Home Nodes
  allowAction.stakewise_v3.stake({ targets: ["Stakesaurus SEA Home Nodes"] }),

  // Uniswap v3 / Oku Trade - wstETH + sDAI + GNO
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, sDAI, GNO] }),
]
