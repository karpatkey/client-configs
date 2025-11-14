import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  ETHx,
  LDO,
  MORPHO,
  OETH,
  osETH,
  rETH,
  RPL,
  SPK,
  sUSDS,
  stETH,
  SWISE,
  USDC,
  USDS,
  USDT,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { Parameters } from "../../../../parameters"

export default (parameters: Parameters) => [
  // Ankr
  allowAction.ankr.deposit(),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Core Market - Deposit ETHx
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETHx"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),

  // Balancer v2 - wstETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer v2 - rETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer v2 - WETH/osETH
  allowAction.balancer_v2.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osETH/wETH-BPT"] }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  // Compound v3 - Deposit USDS
  allowAction.compound_v3.deposit({ targets: ["cUSDSv3"], tokens: ["USDS"] }),
  // Compound v3 - Deposit USDT
  allowAction.compound_v3.deposit({ targets: ["cUSDTv3"], tokens: ["USDT"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - ETH/OETH
  allowAction.convex.deposit({ targets: ["174"] }),
  // Convex - ETH/stETH - stETH-ng-f
  allowAction.convex.deposit({ targets: ["177"] }),
  // Convex - ETH/ETHx - ethx-f
  allowAction.convex.deposit({ targets: ["232"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),

  // CowSwap
  // [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETH, ETHx, LDO, MORPHO, OETH, osETH, rETH, RPL, SPK, stETH, sUSDS, SWISE, USDC, USDS, USDT, WETH, wstETH] ->
  // [ankrETH, DAI, ETH, ETHx, OETH, osETH, rETH, stETH, sUSDS, USDC, USDS, USDT, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      MORPHO,
      OETH,
      osETH,
      rETH,
      RPL,
      SPK,
      stETH,
      sUSDS,
      SWISE,
      USDC,
      USDS,
      USDT,
      WETH,
      wstETH,
    ],
    buy: [
      "ETH",
      ankrETH,
      DAI,
      ETHx,
      OETH,
      osETH,
      rETH,
      stETH,
      sUSDS,
      USDC,
      USDS,
      USDT,
      WETH,
      wstETH,
    ],
  }),

  // CowSwap - TWAP - [ETH, USDC, USDS, USDT] <-> [ETH, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: ["ETH", USDC, USDS, USDT],
    buy: ["ETH", USDC, USDS, USDT],
    twap: true,
    receiver: parameters.avatar,
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit USDT
  allowAction.fluid.deposit({ targets: ["USDT"] }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Market - USDC/cbBTC - id: 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64",
    ],
  }),
  // Morpho Market - WETH/wstETH - id: 0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
    ],
  }),
  // Morpho Market - WETH/wstETH - id: 0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d",
    ],
  }),
  // Morpho Market - USDC/WBTC - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49",
    ],
  }),
  // Morpho Market - USDC/wstETH - id: 0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc",
    ],
  }),

  // Morpho Vault - kpk ETH Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0xd564F765F9aD3E7d2d6cA782100795a885e8e7C8"],
  }),
  // Morpho Vault - kpk ETH v2
  allowAction.morphoVaults.deposit({
    targets: ["0xBb50A5341368751024ddf33385BA8cf61fE65FF9"],
  }),
  // Morpho Vault - kpk EURC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0x0c6aec603d48eBf1cECc7b247a2c3DA08b398DC1"],
  }),
  // Morpho Vault - kpk EURC v2
  allowAction.morphoVaults.deposit({
    targets: ["0xa877D5bb0274dcCbA8556154A30E1Ca4021a275f"],
  }),
  // Morpho Vault - kpk USDC Prime v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0xe108fbc04852B5df72f9E44d7C29F47e7A993aDd"],
  }),
  // Morpho Vault - kpk USDC v2
  allowAction.morphoVaults.deposit({
    targets: ["0x4Ef53d2cAa51C447fdFEEedee8F07FD1962C9ee6"],
  }),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
  // Spark - Stake - Farm USDS
  allowAction.spark.stake(),
  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDS
  allowAction.spark.deposit({ targets: ["USDS"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit wstETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),

  // Stader
  allowAction.stader.deposit(),
]
