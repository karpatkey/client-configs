import { allow as allowAction } from "defi-kit/eth"
import { morpho } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Borrow/repay USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
]
