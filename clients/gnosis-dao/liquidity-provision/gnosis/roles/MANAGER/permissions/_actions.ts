import { allow as allowAction } from "defi-kit/gno"
import {
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

  // Uniswap v3 / Oku Trade - wstETH + sDAI + GNO
  allowAction.uniswap_v3.deposit({ tokens: [wstETH, sDAI, GNO] }),
]
