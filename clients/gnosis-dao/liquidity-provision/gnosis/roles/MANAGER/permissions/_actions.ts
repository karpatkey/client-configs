import { allow as allowAction } from "defi-kit/gno"
import {
  EURe,
  GHO,
  GNO,
  sDAI,
  USDC,
  USDCe,
  USDCE,
  USDT,
  WETH,
  wstETH,
  WXDAI,
  ZCHF,
} from "@/addresses/gno"

export default [
  // Aura - EURe/sDAI
  allowAction.aura.deposit({ targets: ["18"] }),

  // Balancer v2 - EURe/sDAI
  allowAction.balancer_v2.deposit({ targets: ["EURe/sDAI"] }),
  allowAction.balancer_v2.stake({ targets: ["EURe/sDAI"] }),
  // Balancer v2 - USDC.e/USDT/sDAI
  allowAction.balancer_v2.deposit({ targets: ["sBAL3"] }),
  allowAction.balancer_v2.stake({ targets: ["sBAL3"] }),
  // Balancer v2 - Gyroscope - wstETH/GNO
  allowAction.balancer_v2.deposit({ targets: ["ECLP-GNO-wstETH-dyn"] }),
  // Balancer v2 - Gyroscope - USDC.e/GNO
  allowAction.balancer_v2.deposit({ targets: ["ECLP-GNO-USDC.e-dyn"] }),

  // Balancer v2 - wstETH/GNO
  allowAction.balancer_v2.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50wstETH-50GNO"] }),
  // Balancer v2 - sDAI/wstETH
  allowAction.balancer_v2.deposit({ targets: ["B-50sDAI-50wstETH"] }),
  allowAction.balancer_v2.stake({ targets: ["B-50sDAI-50wstETH"] }),

  // CowSwap - [EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI, XDAI] <-> [EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: [
      "XDAI",
      EURe,
      GHO,
      GNO,
      sDAI,
      USDC,
      USDCe,
      USDT,
      WETH,
      wstETH,
      WXDAI,
    ],
    buy: ["XDAI", EURe, GHO, GNO, sDAI, USDC, USDCe, USDT, WETH, wstETH, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // Uniswap v3 / Oku Trade - EURe + sDAI
  allowAction.uniswap_v3.deposit({ tokens: [EURe, sDAI] }),
  // Uniswap v3 / Oku Trade - EURe + ZCHF
  allowAction.uniswap_v3.deposit({ tokens: [EURe, ZCHF] }),
  // Uniswap v3 / Oku Trade - USDC.e + EURe
  allowAction.uniswap_v3.deposit({ tokens: [USDCe, EURe] }),
  // Uniswap v3 / Oku Trade - USDC.e + GHO
  allowAction.uniswap_v3.deposit({ tokens: [USDCe, GNO] }),
  // Uniswap v3 / Oku Trade - USDC.e + sDAI
  allowAction.uniswap_v3.deposit({ tokens: [USDCe, sDAI] }),
  // Uniswap v3 / Oku Trade - USDC.e + USDC.e (Lucid Labs)
  allowAction.uniswap_v3.deposit({ tokens: [USDCe, USDCE] }),
  // Uniswap v3 / Oku Trade - USDC.e + WXDAI
  allowAction.uniswap_v3.deposit({ tokens: [USDCe, WXDAI] }),
  // Uniswap v3 / Oku Trade - wstETH + GNO
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, GNO] }),
  // Uniswap v3 / Oku Trade - wstETH + sDAI
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, sDAI] }),
  // Uniswap v3 / Oku Trade - wstETH + WETH
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, WETH] }),
]
