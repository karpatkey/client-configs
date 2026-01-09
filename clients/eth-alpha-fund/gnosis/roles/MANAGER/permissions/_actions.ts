import { allow as allowAction } from "defi-kit/gno"
import { WETH, wstETH } from "@/addresses/gno"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),

  // Aave v3 - Borrow WETH
  allowAction.aave_v3.borrow({ targets: ["WETH"] }),

  // CowSwap - [WETH, wstETH] <-> [WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [WETH, wstETH],
    buy: [WETH, wstETH],
  }),
]
