import { allow as allowAction } from "defi-kit/gno"
import { GNO, osGNO, sDAI, USDC, USDCe, WXDAI } from "@/addresses/gno"

export default [
  // CowSwap - [GNO, osGNO, sDAI, USDC, USDC.e, WXDAI, xDAI] <-> [GNO, osGNO, sDAI, USDC, USDC.e, WXDAI, xDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", GNO, osGNO, sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", GNO, osGNO, sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
]
