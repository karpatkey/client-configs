import { allow as allowAction } from "defi-kit/gno"
import { EURe, sDAI, USDC, USDCe, USDT, WXDAI } from "@/addresses/gno"

export default [
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

  // CowSwap - [EURe, sDAI, USDC, USDCe, USDT, WXDAI, XDAI] <-> [EURe, sDAI, USDC, USDCe, USDT, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", EURe, sDAI, USDC, USDCe, USDT, WXDAI],
    buy: ["XDAI", EURe, sDAI, USDC, USDCe, USDT, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),

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
]
