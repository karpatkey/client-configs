import { allow as allowAction } from "defi-kit/eth"
import { morpho, syrupUSDT, USDT, XAUt } from "@/addresses/eth"
import {
  MORPHO_MARKET_USDT_SYRUPUSDT,
  MORPHO_MARKET_USDT_XAUT,
} from "../../MANAGER/permissions/_actions"

export default [
  // Aave v3 Core Market - Borrow/repay USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // Morpho Blue - both legs, both directions. This role levers and delevers: leg 2 runs at
  // 85% LTV against a 91.5% LLTV, only 6.5pp of buffer, so it has to be able to repay and
  // pull collateral without waiting on a policy change. Unwinding may take several blocks;
  // that is the agent's problem, not the policy's.
  allowAction.morphoMarkets.borrow({ targets: [MORPHO_MARKET_USDT_XAUT] }),
  allowAction.morphoMarkets.borrow({ targets: [MORPHO_MARKET_USDT_SYRUPUSDT] }),

  // CowSwap - both directions. Levering needs USDT -> syrupUSDT when Maple minting is not
  // the cheaper route; delevering needs syrupUSDT -> USDT to repay, since Maple
  // redemptions are queued.
  allowAction.cowswap.swap({
    sell: [XAUt, USDT, syrupUSDT],
    buy: [XAUt, USDT, syrupUSDT],
  }),
]
