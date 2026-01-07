import { allow as allowAction } from "defi-kit/arb1"
import {
  ezETH,
  rsETH,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 Core Market - Deposit ezETH
  allowAction.aave_v3.deposit({ targets: ["ezETH"] }),
  // Aave v3 Core Market - Deposit rsETH
  allowAction.aave_v3.deposit({ targets: ["rsETH"] }),
  // Aave v3 Core Market - Deposit weETH
  allowAction.aave_v3.deposit({ targets: ["weETH"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 Core Market - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),

  // Aave v3 Core Market - Borrow WETH
  allowAction.aave_v3.borrow({ targets: ["WETH"] }),,

  // CowSwap - [ezETH, rsETH, weETH, WETH, wstETH] <-> [ezETH, rsETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [ezETH, rsETH, weETH, WETH, wstETH],
    buy: [ezETH, rsETH, weETH, WETH, wstETH],
  }),
]
