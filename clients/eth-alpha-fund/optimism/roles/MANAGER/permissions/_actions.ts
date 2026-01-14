import { allow as allowAction } from "defi-kit/oeth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),

  // Aave v3 - Borrow WETH
  allowAction.aave_v3.borrow({ targets: ["WETH"] }),
]
