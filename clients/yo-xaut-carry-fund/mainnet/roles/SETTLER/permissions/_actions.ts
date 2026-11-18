import { allow as allowAction } from "defi-kit/eth"

export default [
  // Aave v3 Core Market - Deposit/withdraw XAUt
  allowAction.aave_v3.deposit({ market: "Core", targets: ["XAUt"] }),
]
