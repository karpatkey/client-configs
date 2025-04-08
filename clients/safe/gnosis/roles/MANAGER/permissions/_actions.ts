import { allow as allowAction } from "defi-kit/gno"
import {
  BAL,
  COW,
  GNO,
  sDAI,
  USDC,
  USDT,
  WETH,
  wstETH,
  osGNO,
  USDCe,
  WXDAI,
  AURA,
  SAFE,
} from "@/addresses/gno"

export default [
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),

  // Aura - Deposit aurabb-WETH-wstETH
  allowAction.aura.deposit({ targets: ["0"] }),
  // Aura - Deposit auraECLP-wstETH-WETH
  allowAction.aura.deposit({ targets: ["25"] }),
  // Aura - Deposit auraosGNO/GNO-BPT
  allowAction.aura.deposit({ targets: ["28"] }),

  //Balancer v2 - bb-WETH-wstETH
  allowAction.balancer_v2.deposit({ targets: ["bb-WETH-wstETH"] }),
  allowAction.balancer_v2.stake({ targets: ["bb-WETH-wstETH"] }),
  //Balancer v2 - ECLP-wstETH-WETH
  allowAction.balancer_v2.deposit({ targets: ["ECLP-wstETH-WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["ECLP-wstETH-WETH"] }),
  //Balancer v2 - ECLP-rETH-WETH
  allowAction.balancer_v2.deposit({ targets: ["ECLP-rETH-WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["ECLP-rETH-WETH"] }),
  //Balancer v2 - 50SAFE-50GNO
  allowAction.balancer_v2.deposit({ targets: ["50SAFE-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["50SAFE-50GNO"] }),
  //Balancer v2 - 50WETH-50GNO
  allowAction.balancer_v2.deposit({ targets: ["0xB8bB1ce9C6E5401D66fE2126dB6E7387E1E24fFE"] }),
  allowAction.balancer_v2.stake({ targets: ["0xB8bB1ce9C6E5401D66fE2126dB6E7387E1E24fFE"] }),
  //Balancer v2 - osGNO/GNO-BPT
  allowAction.balancer_v2.deposit({ targets: ["osGNO/GNO-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osGNO/GNO-BPT"] }),
  //Balancer v2 - B-50wstETH-50GNO
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-50GNO"] }),

  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - Chorus One
  allowAction.stakewise_v3.stake({ targets: ["Chorus One"] }),
  // StakeWise v3 - Axol.io
  allowAction.stakewise_v3.stake({ targets: ["Axol.io"] }),
  // StakeWise v3 - Stakecat
  allowAction.stakewise_v3.stake({ targets: ["Stakecat"] }),

  // CowSwap - swaps
  allowAction.cowswap.swap({
    sell: [
      AURA,
      BAL,
      COW,
      GNO,
      //Pending response from AMs      LDO,
      osGNO,
      SAFE,
      sDAI,
      //Pending response from AMs           stETH,
      //Pending response from AMs           SWISE,
      USDC,
      USDCe,
      USDT,
      WETH,
      wstETH,
      WXDAI,
      "XDAI",
    ],
    buy: [
      GNO,
      osGNO,
      SAFE,
      sDAI,
      //Pending response from AMs           stETH,
      USDC,
      USDCe,
      USDT,
      WETH,
      wstETH,
      WXDAI,
      "XDAI",
    ],
  }),
]
