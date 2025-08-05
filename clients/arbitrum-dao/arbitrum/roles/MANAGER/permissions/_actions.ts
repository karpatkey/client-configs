import { allow as allowAction } from "defi-kit/arb1"

export default [
  // Aave v3 Arbitrum Market - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 Arbitrum Market - Deposit GHO
  allowAction.aave_v3.deposit({ targets: ["GHO"] }),
  // Aave v3 Arbitrum Market - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 Arbitrum Market - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),

]