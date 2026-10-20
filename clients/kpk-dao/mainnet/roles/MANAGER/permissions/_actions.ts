import { allow as allowAction } from "defi-kit/eth"
import {
  cbBTC,
  COMP,
  eETH,
  ETHPlus,
  FLUID,
  GEAR,
  GNO,
  LsETH,
  MORPHO,
  rETH,
  SPK,
  stETH,
  USDC,
  WBTC,
  weETH,
  WETH,
  wstETH,
  XAUt,
  gearbox,
  morpho,
} from "@/addresses/eth"

export default [
  // Aave Safety Module - Stake AAVE (stake, cooldown, redeem, claim, claim and restake)
  allowAction.aave_v3.stake({ targets: ["AAVE"] }),

  // CowSwap - [ETH, WETH, stETH, wstETH, eETH, weETH, rETH, LsETH, USDC, XAUt, WBTC, cbBTC, SPK, MORPHO, GEAR, ETH+, FLUID, COMP] ->
  // [ETH, WETH, stETH, wstETH, eETH, weETH, rETH, LsETH, USDC, XAUt, WBTC, cbBTC]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      WETH,
      stETH,
      wstETH,
      eETH,
      weETH,
      rETH,
      LsETH,
      USDC,
      XAUt,
      WBTC,
      cbBTC,
      SPK,
      MORPHO,
      GEAR,
      ETHPlus,
      FLUID,
      COMP,
    ],
    buy: [
      "ETH",
      WETH,
      stETH,
      wstETH,
      eETH,
      weETH,
      rETH,
      LsETH,
      USDC,
      XAUt,
      WBTC,
      cbBTC,
    ],
  }),
  // CowSwap - GNO -> [ETH, WETH, stETH, wstETH]
  allowAction.cowswap.swap({
    sell: [GNO],
    buy: ["ETH", WETH, stETH, wstETH],
  }),

  // Fluid - Deposit wstETH
  allowAction.fluid.deposit({ targets: ["wstETH"] }),

  // Gearbox - ETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWeth],
  }),
  // Gearbox - wstETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWstEth],
  }),

  // Lido - stake, wrap/unwrap, request withdrawals (stETH and wstETH), claim
  allowAction.lido.deposit(),

  // Morpho Vault - kpk ETH Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV2],
  }),
  // Morpho Vault - kpk ETH Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthYieldV2],
  }),

  // Rocket Pool - stake / unstake
  allowAction.rocket_pool.deposit(),
]
