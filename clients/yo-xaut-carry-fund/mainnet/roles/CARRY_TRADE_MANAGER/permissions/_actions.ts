import { allow as allowAction } from "defi-kit/eth"

export default [
  // Aave v3 Core Market - Borrow/repay USDC for the avatar (onBehalfOf pinned): the debt leg,
  // with the USDC approval to the Pool that repay needs. No other borrow asset. The USDC vaults
  // are hand-scoped in calls.ts.
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),
]
