import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, USDG } from "@/addresses/eth"

export default [
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // CowSwap - USDG <-> USDC both ways: USDG borrowed on the Aave v4 Core Hub goes into the
  // USDC vaults, and USDC from the vaults is swapped back to USDG to repay.
  allowAction.cowswap.swap({ sell: [USDC, USDG], buy: [USDC, USDG] }),
]
