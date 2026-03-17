import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  AURA,
  BAL,
  cbBTC,
  CRV,
  CVX,
  DAI,
  eETH,
  ETHPlus,
  ETHx,
  FLUID,
  GHO,
  LDO,
  MORPHO,
  osETH,
  rETH,
  RPL,
  rsETH,
  sUSDS,
  stETH,
  SPK,
  SWISE,
  USDC,
  USDS,
  USDT,
  weETH,
  WETH,
  wNXM,
  wstETH,
  gearbox,
  morpho,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit rETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rETH"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 Core Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),

  // Aave v3 Prime Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["ETH"] }),
  // Aave v3 Prime Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["USDC"] }),
  // Aave v3 Prime Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["WETH"] }),
  // Aave v3 Prime Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["wstETH"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),
  // Convex - ETH+/WETH
  allowAction.convex.deposit({ targets: ["470"] }),

  // CowSwap - [AAVE, AURA, BAL, CRV, CVX, FLUID, LDO, MORPHO, RPL, SPK, SWISE, wNXM] ->
  // [DAI, ETH, GHO, USDC, USDS, USDT, WETH, wNXM, wstETH]
  allowAction.cowswap.swap({
    sell: [
      AAVE,
      AURA,
      BAL,
      CRV,
      CVX,
      FLUID,
      LDO,
      MORPHO,
      RPL,
      SPK,
      SWISE,
      wNXM,
    ],
    buy: ["ETH", DAI, GHO, USDC, USDS, USDT, WETH, wNXM, wstETH],
  }),

  // CowSwap - [GHO, sUSDS, stETH, USDC, USDS, WETH, wNXM, wstETH] <-> [GHO, sUSDS, stETH, USDC, USDS, WETH, wNXM, wstETH]
  allowAction.cowswap.swap({
    sell: [GHO, sUSDS, stETH, USDC, USDS, WETH, wNXM, wstETH],
    buy: [GHO, sUSDS, stETH, USDC, USDS, WETH, wNXM, wstETH],
  }),

  // CowSwap - [eETH, ETH, ETH+, ETHx, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH] <-> [eETH, ETH, ETH+, ETHx, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH", eETH, ETHPlus, ETHx, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH],
    buy: ["ETH", eETH, ETHPlus, ETHx, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH],
  }),

  // CowSwap - [cbBTC] -> [USDC, USDT, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [cbBTC],
    buy: [USDC, USDT, WETH, wstETH],
  }),

  // CowSwap - TWAP - [stETH] -> [USDC]
  allowAction.cowswap.swap({
    sell: [stETH],
    buy: [USDC],
    twap: true,
    receiver: parameters.avatar,
  }),

  // CowSwap - TWAP - [wNXM] -> [WETH]
  allowAction.cowswap.swap({
    sell: [wNXM],
    buy: [WETH],
    twap: true,
    receiver: parameters.avatar,
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit USDT
  allowAction.fluid.deposit({ targets: ["USDT"] }),

  // Gearbox - ETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWeth],
  }),
  // Gearbox - wstETH v3 - Curator: kpk
  allowAction.gearbox.deposit({
    targets: [gearbox.kpkWstEth],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Vault - Gauntlet USDC Prime v1
  allowAction.morphoVaults.deposit({
    targets: [morpho.gtUsdc],
  }),
  // Morpho Vault - kpk ETH Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV1],
  }),
  // Morpho Vault - kpk ETH Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV2],
  }),
  // Morpho Vault - kpk ETH Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthYieldV1],
  }),
  // Morpho Vault - kpk ETH Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthYieldV2],
  }),
  // Morpho Vault - kpk USDC Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV1],
  }),
  // Morpho Vault - kpk USDC Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcPrimeV2],
  }),
  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV1],
  }),
  // Morpho Vault - kpk USDC Yield v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdcYieldV2],
  }),
  // Morpho Vault - Steakhouse USDC v1
  allowAction.morphoVaults.deposit({
    targets: [morpho.steakUsdc],
  }),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - Deposit rETH
  allowAction.spark.deposit({ targets: ["rETH"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit wstETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // Uniswap v3 - wNXN/WETH
  allowAction.uniswap_v3.deposit({ tokens: ["wNXM", "WETH"] }),
]
