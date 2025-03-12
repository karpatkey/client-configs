import { allow as allowAction } from "defi-kit/gno"
import {
  COW,
  EURCe,
  EURe,
  GNO,
  OLAS,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
  x3CRV,
  curve,
} from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit EURe
  allowAction.aave_v3.deposit({ targets: ["EURe"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),

  // Aura - WETH/wstETH
  allowAction.aura.deposit({ targets: ["0"] }),
  // Aura - EURe/sDAI
  allowAction.aura.deposit({ targets: ["18"] }),
  // Aura - Gyroscope ECLP rETH/WETH
  allowAction.aura.deposit({ targets: ["26"] }),

  // Balancer v2 - wstETH/GNO
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50GNO"] }),
  // Balancer v2 - sDAI/wstETH
  allowAction.balancer.deposit({ targets: ["B-50sDAI-50wstETH"] }),
  allowAction.balancer.stake({ targets: ["B-50sDAI-50wstETH"] }),
  // Balancer v2 - USDC.e/USDT/sDAI
  allowAction.balancer.deposit({ targets: ["sBAL3"] }),
  allowAction.balancer.stake({ targets: ["sBAL3"] }),
  // Balancer v2 - WETH/wstETH
  allowAction.balancer.deposit({ targets: ["bb-WETH-wstETH"] }),
  allowAction.balancer.stake({ targets: ["bb-WETH-wstETH"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-rETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-rETH-WETH"] }),
  // Balancer v2 - osGNO/GNO
  allowAction.balancer.deposit({ targets: ["osGNO/GNO-BPT"] }),
  allowAction.balancer.stake({ targets: ["osGNO/GNO-BPT"] }),
  // Balancer v2 - WBTC/WETH
  allowAction.balancer.deposit({ targets: ["50WBTC-50WETH"] }),
  allowAction.balancer.stake({ targets: ["50WBTC-50WETH"] }),
  // Balancer v2 - Gyroscope ECLP wstETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-wstETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-wstETH-WETH"] }),
  // Balancer v2 - wstETH/BAL/AURA
  allowAction.balancer.deposit({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  // Balancer v2 - wstETH/COW
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50COW"] }),
  // Balancer v2 - COW/GNO
  allowAction.balancer.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50COW-50GNO"] }),
  // Balancer v2 - stEUR/EURe
  allowAction.balancer.deposit({ targets: ["stEUR/EURe"] }),
  allowAction.balancer.stake({ targets: ["stEUR/EURe"] }),
  // Balancer v2 - GIV/GNO
  allowAction.balancer.deposit({ targets: ["50GIV-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50GIV-50GNO"] }),
  // Balancer v2 - WXDAI/GNO
  allowAction.balancer.deposit({ targets: ["WXDAI-GNO"] }),
  allowAction.balancer.stake({ targets: ["WXDAI-GNO"] }),
  // Balancer v2 - EURe/sDAI
  allowAction.balancer.deposit({ targets: ["EURe/sDAI"] }),
  allowAction.balancer.stake({ targets: ["EURe/sDAI"] }),
  // Balancer v2 - WBTC/WSTETH
  allowAction.balancer.deposit({ targets: ["50WBTC/50WSTETH"] }),
  allowAction.balancer.stake({ targets: ["50WBTC/50WSTETH"] }),

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

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - Deposit WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - Deposit EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),

  // Uniswap v3 / Oku Trade - wstETH + sDAI
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, sDAI, GNO] }),
]
