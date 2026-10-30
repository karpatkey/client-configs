import { allow as allowAction } from "defi-kit/eth"
import { frxUSD, syrupUSDG, USDC, USDG, USDT } from "@/addresses/eth"

export default [
  // CowSwap - USD stablecoins between each other, both ways: the vaults' USDC into USDG or
  // frxUSD to repay, and any USD stablecoin the fund holds (incl. USDT) back to USDC.
  allowAction.cowswap.swap({
    sell: [frxUSD, USDC, USDG, USDT],
    buy: [frxUSD, USDC, USDG, USDT],
  }),

  // CowSwap - sell-only emergency exit for the loop collateral when Maple's queue is too slow
  allowAction.cowswap.swap({ sell: [syrupUSDG], buy: [USDC, USDG] }),
]
