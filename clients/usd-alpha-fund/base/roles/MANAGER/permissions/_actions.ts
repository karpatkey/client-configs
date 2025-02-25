import { allow as allowAction } from "defi-kit/base"

export default [
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
]
