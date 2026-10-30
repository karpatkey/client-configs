import { allow as allowAction } from "defi-kit/eth"
import { syrupUSDG, USDC, USDG } from "@/addresses/eth"

export default [
  // CowSwap - USDC -> USDG to repay USDG debt from the vaults' USDC, and back.
  allowAction.cowswap.swap({ sell: [USDC, USDG], buy: [USDC, USDG] }),

  // CowSwap - sell-only emergency exit for the loop collateral when Maple's queue is too slow
  allowAction.cowswap.swap({ sell: [syrupUSDG], buy: [USDC, USDG] }),
]
