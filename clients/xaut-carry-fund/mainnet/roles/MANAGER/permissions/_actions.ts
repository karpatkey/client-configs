import { allow as allowAction } from "defi-kit/eth"
import { morpho, syrupUSDT, USDC, USDT, XAUt } from "@/addresses/eth"

// Morpho Blue market ids, verified on-chain against idToMarketParams() on the Morpho
// singleton 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb:
//   leg 1 - loan USDT / collateral XAUt      / LLTV 77.0% / AdaptiveCurveIRM
//   leg 2 - loan USDT / collateral syrupUSDT / LLTV 91.5% / AdaptiveCurveIRM
export const MORPHO_MARKET_USDT_XAUT =
  "0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877"
export const MORPHO_MARKET_USDT_SYRUPUSDT =
  "0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a"

export default [
  // Aave v3 Core Market - Deposit/withdraw XAUt
  allowAction.aave_v3.deposit({ market: "Core", targets: ["XAUt"] }),
  // Aave v3 Core Market - Borrow/repay USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({ targets: [morpho.kpkUsdcYieldV2] }),

  // Morpho Blue - leg 1: supply/withdraw XAUt collateral, borrow/repay USDT
  allowAction.morphoMarkets.borrow({ targets: [MORPHO_MARKET_USDT_XAUT] }),
  // Morpho Blue - leg 2: supply/withdraw syrupUSDT collateral, borrow/repay USDT
  allowAction.morphoMarkets.borrow({ targets: [MORPHO_MARKET_USDT_SYRUPUSDT] }),

  // CowSwap - XAUt/USDC for subscription settlement, plus USDT and syrupUSDT for the
  // Morpho loop. Maple redemptions are queue-based, so selling syrupUSDT on the secondary
  // market is the only fast way to raise the USDT needed to repay the leg 2 debt.
  allowAction.cowswap.swap({
    sell: [XAUt, USDC, USDT, syrupUSDT],
    buy: [XAUt, USDC, USDT, syrupUSDT],
  }),
]
