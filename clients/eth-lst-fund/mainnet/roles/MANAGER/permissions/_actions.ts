import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  cbETH,
  CRV,
  CVX,
  eETH,
  ETHFI,
  ETHx,
  liquidETH,
  osETH,
  rETH,
  RPL,
  stETH,
  SWISE,
  weETH,
  WETH,
  wstETH,
  curve,
} from "@/addresses/eth"
import { contracts } from "@/contracts"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer v2 - osETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osETH/wETH-BPT"] }),

  // Convex - ETHx/ETH - ethx-f
  allowAction.convex.deposit({ targets: ["232"] }),
  // Convex - ankrETH/ETH
  allowAction.convex.deposit({ targets: ["27"] }),

  // CowSwap - [ankrETH, AURA, BAL, cbETH, CRV, CVX, eETH, ETH, ETHFI, ETHx, liquidETH, osETH, rETH, RPL, stETH, SWISE, weETH, WETH, wstETH] ->
  // [ankrETH, cbETH, eETH, ETH, ETHx, liquidETH, osETH, rETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      ankrETH,
      AURA,
      BAL,
      cbETH,
      CRV,
      CVX,
      eETH,
      "ETH",
      ETHFI,
      ETHx,
      liquidETH,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      ankrETH,
      cbETH,
      eETH,
      "ETH",
      ETHx,
      liquidETH,
      osETH,
      rETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
  }),

  // Uniswap v3 - WETH/wstETH
  allowAction.uniswap_v3.deposit({ tokens: ["WETH", "wstETH"] }),
  // Uniswap v3 - cbETH/WETH
  allowAction.uniswap_v3.deposit({ tokens: ["cbETH", "WETH"] }),
]
