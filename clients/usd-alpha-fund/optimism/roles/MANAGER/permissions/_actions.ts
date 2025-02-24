import { allow as allowAction } from "defi-kit/oeth"

export default [
  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USDT"] }),
]
