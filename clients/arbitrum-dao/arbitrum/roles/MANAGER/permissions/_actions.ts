import { allow as allowAction } from "defi-kit/arb1"
import {
  ARB,
  DAI,
  EUL,
  GHO,
  FLUID,
  MORPHO,
  PENDLE,
  sUSDai,
  sUSDe,
  sUSDS,
  syrupUSDC,
  USDai,
  USDC,
  USDe,
  USDCe,
  USDS,
  USDT,
  morpho,
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

  // CowSwap - [ARB, DAI, ETH, EUL, GHO, FLUID, MORPHO, PENDLE, sUSDai, sUSDe, sUSDS, syrupUSDC, USDai, USDC, USDC.e, USDe, USDS, USDT] ->
  // [DAI, GHO, sUSDai, sUSDe, sUSDS, syrupUSDC, USDai, USDC, USDC.e, USDe, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      ARB,
      DAI,
      EUL,
      GHO,
      FLUID,
      MORPHO,
      PENDLE,
      sUSDai,
      sUSDe,
      sUSDS,
      syrupUSDC,
      USDai,
      USDC,
      USDCe,
      USDe,
      USDS,
      USDT,
    ],
    buy: [
      DAI,
      GHO,
      sUSDai,
      sUSDe,
      sUSDS,
      syrupUSDC,
      USDai,
      USDC,
      USDCe,
      USDe,
      USDS,
      USDT,
    ],
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit sUSDS
  allowAction.fluid.deposit({ targets: ["sUSDS"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit USDT
  allowAction.fluid.deposit({ targets: ["USD₮0"] }),

  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdc],
  }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcV2],
  }),
]
