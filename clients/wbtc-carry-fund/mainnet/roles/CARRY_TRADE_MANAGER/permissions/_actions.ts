import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, USDG } from "@/addresses/eth"

export default [
  // CowSwap - USDG <-> USDC both ways (sell and buy orders): USDG borrowed on the Aave v4 Core
  // Hub line is sold for USDC before it goes into the vaults, and USDC is swapped back to USDG
  // to repay. Same scope as HF_KEEPER.
  allowAction.cowswap.swap({ sell: [USDC, USDG], buy: [USDC, USDG] }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
]
