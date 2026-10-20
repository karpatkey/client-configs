import { allow as allowAction } from "defi-kit/eth"
import { morpho, USDC, USDG } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Borrow/repay USDC for the avatar (onBehalfOf pinned): the debt leg of
  // aave_v3_health_factor_manager when the fund runs on Aave v3 Core
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // CowSwap - USDG <-> USDC both ways: USDG borrowed on the Aave v4 Core Hub goes into the
  // USDC vaults, and USDC from the vaults is swapped back to USDG to repay.
  allowAction.cowswap.swap({ sell: [USDC, USDG], buy: [USDC, USDG] }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),
]
