import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  COMP,
  COW,
  CRV,
  CVX,
  DAI,
  ETHx,
  GHO,
  GNO,
  LDO,
  OETH,
  OGN,
  osETH,
  rETH,
  RPL,
  SAFE,
  sDAI,
  SKY,
  stETH,
  sUSDS,
  SWISE,
  UNI,
  USDC,
  USDM,
  USDS,
  USDT,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  //To discuss why naming is changing
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),
  // Aura - auraB-80GNO-20WETH
  allowAction.aura.deposit({ targets: ["116"] }),
  // Aura - auraETHx/wstETH
  allowAction.aura.deposit({ targets: ["207"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
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
  // Balancer v2 - osETH/WETH
  allowAction.balancer_v2.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["osETH/wETH-BPT"] }),
  // Balancer v2 - B-80GNO-20WETH
  allowAction.balancer_v2.deposit({ targets: ["B-80GNO-20WETH"] }),
  allowAction.balancer_v2.stake({ targets: ["B-80GNO-20WETH"] }),
  // Balancer v2 - ETHx/wstETH
  allowAction.balancer_v2.deposit({ targets: ["ETHx/wstETH"] }),
  allowAction.balancer_v2.stake({ targets: ["ETHx/wstETH"] }),
  // Balancer v2 - ezETH-WETH-BPT
  allowAction.balancer_v2.deposit({ targets: ["ezETH-WETH-BPT"] }),
  allowAction.balancer_v2.stake({ targets: ["ezETH-WETH-BPT"] }),
  // Balancer v2 - B-stETH-STABLE
  allowAction.balancer_v2.deposit({ targets: ["B-stETH-STABLE"] }),
  allowAction.balancer_v2.stake({ targets: ["B-stETH-STABLE"] }),

  // TO discuss about comet targets
  // Compound v3 - Deposit USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"], tokens: ["USDC"] }),
  // Compound v3 - Deposit USDS
  allowAction.compound_v3.deposit({ targets: ["cUSDSv3"], tokens: ["USDS"] }),
  // Compound v3 - Deposit USDT
  allowAction.compound_v3.deposit({ targets: ["cUSDTv3"], tokens: ["USDT"] }),
  // Compound v3 - Deposit WETH
  allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["WETH"] }),

  // To discuss
  // Convex - Deposit DAI-USDC-USDT
  allowAction.convex.deposit({ targets: ["9"] }),
  // Convex - Deposit ETH-stETH
  allowAction.convex.deposit({ targets: ["177"] }),
  // Convex - Deposit oETH-ETH
  allowAction.convex.deposit({ targets: ["174"] }),
  // Convex - Deposit weETH/WETH
  allowAction.convex.deposit({ targets: ["355"] }),
  // Convex - Deposit ETH+rETH
  allowAction.convex.deposit({ targets: ["287"] }),

  // Spark - Deposit DAI
  allowAction.spark.deposit({ targets: ["DAI"] }),
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
  // Spark - Deposit DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - stake
  allowAction.spark.stake(),

  // To discuss //Sky - Deposit USDS
  allowAction.sky.deposit({
    targets: ["USDS"],
    avatar: "0xd28b432f06cb64692379758b88b5fcdfc4f56922",
  }),

  // CowSwap - SAFE -> [DAI, ETH, stETH, USDC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [SAFE],
    buy: ["ETH", DAI, stETH, USDC, WETH, wstETH],
  }),
  // CowSwap - ETH -> [DAI, osETH, stETH, rETH, USDC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH"],
    buy: [DAI, osETH, stETH, rETH, USDC, WETH, wstETH],
  }),
  // CowSwap - [AURA, BAL] -> [ETH, USDC, WETH]
  allowAction.cowswap.swap({
    sell: [AURA, BAL],
    buy: ["ETH", USDC, WETH],
  }),
  // Coswap - swaps
  allowAction.cowswap.swap({
    sell: [
      AURA,
      BAL,
      COMP,
      COW,
      CRV,
      CVX,
      DAI,
      "ETH",
      ETHx,
      GHO,
      GNO,
      LDO,
      OETH,
      OGN,
      osETH,
      SAFE,
      SKY,
      // SPK seems that is not deployed yet https://docs.spark.fi/governance/spk-token,
      stETH,
      sDAI,
      sUSDS,
      SWISE,
      UNI,
      USDC,
      USDM,
      USDS,
      USDT,
      WETH,
      wstETH,
      rETH,
      RPL,
    ],
    buy: [
      DAI,
      "ETH",
      ETHx,
      GHO,
      GNO,
      OETH,
      osETH,
      SAFE,
      stETH,
      sDAI,
      sUSDS,
      USDC,
      USDM,
      USDS,
      USDT,
      WETH,
      wstETH,
      rETH,
    ],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket pool
  allowAction.rocket_pool.deposit(),

  //Stader
  allowAction.stader.deposit(),

  //StakeWise v3
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // To discuss about specifying the fees on safe + weth
  // Uniswap v3 - SAFE + WETH - Current NFT Ids: 711659 and 774338
  allowAction.uniswap_v3.deposit({
    tokens: ["SAFE", "WETH"],
    fees: ["0.3%", "1%"],
  }),
  // Uniswap v3 - SAFE + USDC
  allowAction.uniswap_v3.deposit({
    tokens: ["SAFE", "USDC"],
    fees: ["0.3%", "1%"],
  }),
  // Uniswap v3 - SAFE + USDT
  allowAction.uniswap_v3.deposit({
    tokens: ["SAFE", "USDT"],
    fees: ["0.3%", "1%"],
  }),
  // Uniswap v3 - WETH + USDC
  allowAction.uniswap_v3.deposit({
    tokens: ["WETH", "USDC"],
    fees: ["0.05%", "0.3%"],
  }),
  // Uniswap v3 - WETH + USDT
  allowAction.uniswap_v3.deposit({
    tokens: ["WETH", "USDT"],
    fees: ["0.05%", "0.3%"],
  }),
]
