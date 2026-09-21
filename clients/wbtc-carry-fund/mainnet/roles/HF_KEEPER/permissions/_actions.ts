import { allow as allowAction } from "defi-kit/eth"
import { morpho } from "@/addresses/eth"

export default [
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
]
