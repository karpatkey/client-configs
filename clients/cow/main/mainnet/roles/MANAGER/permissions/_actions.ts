import { allow as allowAction } from "defi-kit/eth"
import { 
  AAVE,
  COMP,
  DAI,
  EURC,
  GHO,
  MORPHO,
  osETH,
  POL,
  rETH,
  sDAI,
  stETH,
  stkGHO,
  sUSDe,
  sUSDS,
  syrupUSDC,
  USDC,
  USDe,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit EURC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["EURC"] }),
  // Aave v3 Core Market - Deposit GHO
  allowAction.aave_v3.deposit({ market: "Core", targets: ["GHO"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit WBTC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WBTC"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),

  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  // Compound v3 - Deposit USDS
  allowAction.compound_v3.deposit({ targets: ["cUSDSv3"], tokens: ["USDS"] }),
  // Compound v3 - Deposit USDT
  allowAction.compound_v3.deposit({ targets: ["cUSDTv3"], tokens: ["USDT"] }),
  // Compound v3 - Deposit WBTC
  allowAction.compound_v3.deposit({ targets: ["cWBTCv3"], tokens: ["WBTC"] }),
  // Compound v3 - Deposit WETH
  allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["WETH"] }),
  // Compound v3 - Deposit wstETH
  allowAction.compound_v3.deposit({ targets: ["cWstETHv3"], tokens: ["wstETH"] }),

  // CowSwap - [DAI, ETH, EURC, GHO, sDAI, stkGHO, sUSDe, sUSDS, syrupUSDC, USDC, USDe, USDS, USDT, WETH] <-> 
  // [DAI, ETH, EURC, GHO, sDAI, stkGHO, sUSDe, sUSDS, syrupUSDC, USDC, USDe, USDS, USDT, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", DAI, EURC, GHO, sDAI, stkGHO, sUSDe, sUSDS, syrupUSDC, USDC, USDe, USDS, USDT, WETH],
    buy: ["ETH", DAI, EURC, GHO, sDAI, stkGHO, sUSDe, sUSDS, syrupUSDC, USDC, USDe, USDS, USDT, WETH],
  }),

  // CowSwap - [ETH, osETH, rETH, stETH, WETH, wstETH] <-> 
  // [ETH, osETH, rETH, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH", osETH, rETH, stETH, WETH, wstETH],
    buy: ["ETH", osETH, rETH, stETH, WETH, wstETH],
  }),

  // CowSwap - [ETH, osETH, rETH, stETH, WETH, wstETH] <-> 
  // [ETH, osETH, rETH, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH", osETH, rETH, stETH, WETH, wstETH],
    buy: ["ETH", osETH, rETH, stETH, WETH, wstETH],
  }),

  // CowSwap - [AAVE, COMP, ETH, MORPHO, POL, USDC, USDT, WBTC, WETH] <-> 
  // [AAVE, COMP, ETH, MORPHO, POL, USDC, USDT, WBTC, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", AAVE, COMP, MORPHO, POL, USDC, USDT, WBTC, WETH],
    buy: ["ETH", AAVE, COMP, MORPHO, POL, USDC, USDT, WBTC, WETH],
  }),

  // Lido
  allowAction.lido.deposit(),

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

  // Spark - Deposit DAI
  allowAction.spark.deposit({ targets: ["DAI"] }),
  // Spark - Deposit sUSDS
  allowAction.spark.deposit({ targets: ["sUSDS"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit USDS
  allowAction.spark.deposit({ targets: ["USDS"] }),
  // Spark - Deposit USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - Deposit WBTC
  allowAction.spark.deposit({ targets: ["WBTC"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - SKY_spUSDC
  allowAction.spark.deposit({ targets: ["SKY_spUSDC"] }),
  // Spark - SKY_sUSDS
  allowAction.spark.deposit({ targets: ["SKY_sUSDS"] }),
  // Spark - SKY_spUSDT
  allowAction.spark.deposit({ targets: ["SKY_spUSDT"] }),

  // Uniswap v3 - WETH + COW - NFT Id: 1129129
  allowAction.uniswap_v3.deposit({ targets: ["1129129"] }),
]
