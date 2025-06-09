import { allow as allowAction } from "defi-kit/gno"
import { sDAI, USDC, USDCe, USDT, WXDAI } from "@/addresses/gno"

export default [
  // CowSwap - [sDAI, USDC, USDCe, USDT, WXDAI, XDAI] <-> [sDAI, USDC, USDCe, USDT, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", sDAI, USDC, USDCe, USDT, WXDAI],
    buy: ["XDAI", sDAI, USDC, USDCe, USDT, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
]
