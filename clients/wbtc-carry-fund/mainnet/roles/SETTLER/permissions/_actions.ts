import { allow as allowAction } from "defi-kit/eth"

export default [
  // Aave v3 Core Market - Deposit/withdraw cbBTC and WBTC for the avatar: process_subscriptions_aave
  // and process_redemptions_aave post and pull the BTC collateral when the fund runs on Aave v3
  // Core. cbBTC sits next to WBTC as a second collateral, not swapped to WBTC.
  allowAction.aave_v3.deposit({ market: "Core", targets: ["cbBTC", "WBTC"] }),
]
