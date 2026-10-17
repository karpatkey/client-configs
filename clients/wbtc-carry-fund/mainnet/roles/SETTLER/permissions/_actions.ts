import { allow as allowAction } from "defi-kit/eth"

export default [
  // Aave v3 Core Market - Deposit/withdraw WBTC for the avatar: process_subscriptions_aave and
  // process_redemptions_aave post and pull the WBTC collateral when the fund runs on Aave v3 Core
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WBTC"] }),
]
