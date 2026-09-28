import { allow as allowAction } from "defi-kit/eth"
import { syrupUSDT, USDT, XAUt } from "@/addresses/eth"

export default [
  // CowSwap - directional, exit only. The leg 2 collateral is syrupUSDT while the debt is
  // USDT, so the position cannot be repaid without converting first; Maple redemptions go
  // through a queue, making the secondary market the only fast route. Selling XAUt covers
  // the leg 1 debt in the same way. Nothing buys back into a position.
  allowAction.cowswap.swap({
    sell: [syrupUSDT, XAUt],
    buy: [USDT],
  }),
]
