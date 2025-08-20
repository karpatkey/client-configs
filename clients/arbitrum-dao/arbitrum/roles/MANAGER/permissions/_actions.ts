import { allow as allowAction } from "defi-kit/arb1"
import {
  DAI,
  EUL,
  GHO,
  FLUID,
  sUSDS,
  USDC,
  USDCe,
  USDS,
  USDT,
} from "@/addresses/arb1"

export default [
  // Aave v3 Arbitrum Market - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 Arbitrum Market - Deposit GHO
  allowAction.aave_v3.deposit({ targets: ["GHO"] }),
  // Aave v3 Arbitrum Market - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 Arbitrum Market - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),
  // Aave v3 Arbitrum Market - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),
  // Aave v3 Arbitrum Market - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),
  // Aave v3 Arbitrum Market - Borrow USDC.e
  allowAction.aave_v3.borrow({ targets: ["USDC.e"] }),
  // Aave v3 Arbitrum Market - Borrow USDT
  allowAction.aave_v3.borrow({ targets: ["USD₮0"] }),

  // CowSwap - [DAI, ETH, EUL, GHO, FLUID, sUSDS, USDC, USDC.e, USDS, USDT] -> [DAI, GHO, sUSDS, USDC, USDC.e, USDS, USDT]
  allowAction.cowswap.swap({
    sell: ["ETH", DAI, EUL, GHO, FLUID, sUSDS, USDC, USDCe, USDS, USDT],
    buy: [DAI, GHO, sUSDS, USDC, USDCe, USDS, USDT],
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit sUSDS
  allowAction.fluid.deposit({ targets: ["sUSDS"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit USDT
  allowAction.fluid.deposit({ targets: ["USDT"] }),
]
