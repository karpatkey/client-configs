import { allow as allowAction } from "defi-kit/eth"
import { DAI, sDAI, USDC, USDT } from "@/addresses/eth"
import { PermissionList } from "@/types"

export default [
  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({ sell: [DAI, USDC], buy: [DAI, USDC] }),

  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({ sell: [DAI, USDT], buy: [DAI, USDT] }),

  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({ sell: [USDC, USDT], buy: [USDC, USDT] }),

  // CowSwap - sDAI <-> USDC
  allowAction.cowswap.swap({ sell: [sDAI, USDC], buy: [sDAI, USDC] }),

  // CowSwap - sDAI <-> USDT
  allowAction.cowswap.swap({ sell: [sDAI, USDT], buy: [sDAI, USDT] }),
]
