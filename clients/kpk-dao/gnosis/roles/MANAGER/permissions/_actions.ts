import { allow as allowAction } from "defi-kit/gno"
import { GNO, WETH, wstETH } from "@/addresses/gno"

export default [
  // CowSwap - [GNO, WETH, wstETH] -> [WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [GNO, WETH, wstETH],
    buy: [WETH, wstETH],
  }),
]
