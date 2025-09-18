import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  ETHx,
  ezETH,
  GHO,
  KING,
  MORPHO,
  OETH,
  osETH,
  rETH,
  RLUSD,
  rsETH,
  SD,
  stETH,
  USDC,
  USDe,
  USDS,
  USDT,
  USR,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Aave v3 - Deposit ETHx
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETHx"] }),
  // Aave v3 - Deposit ezETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ezETH"] }),
  // Aave v3 - Deposit RLUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["RLUSD"] }),
  // Aave v3 - Deposit rsETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rsETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 - Deposit weETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["weETH"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),
  // Aave v3 - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ market: "Core", targets: ["GHO"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),
  // Aave v3 - Borrow USDS
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDS"] }),
  // Aave v3 - Borrow USDT
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDT"] }),
  // Aave v3 - Borrow WBTC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["WBTC"] }),

  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer - Lock
  allowAction.balancer_v2.lock(),

  // CowSwap - [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR] <-> [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR]
  allowAction.cowswap.swap({
    sell: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
    buy: [DAI, GHO, RLUSD, USDe, USDC, USDS, USDT, USR],
  }),

  // CowSwap - [KING, MORPHO, SD] -> [USDC]
  allowAction.cowswap.swap({
    sell: [KING, MORPHO, SD],
    buy: [USDC],
  }),

  // CowSwap - USDC <-> WETH
  allowAction.cowswap.swap({
    sell: [USDC, WETH],
    buy: [USDC, WETH],
  }),
  // CowSwap - USDC <-> wstETH
  allowAction.cowswap.swap({
    sell: [USDC, wstETH],
    buy: [USDC, wstETH],
  }),

  // CowSwap - [ETH, ETHx, ezETH, OETH, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH] <-> [ETH, ETHx, ezETH, OETH, osETH, rETH, rsETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      ETHx,
      ezETH,
      OETH,
      osETH,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      "ETH",
      ETHx,
      ezETH,
      OETH,
      osETH,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
  }),

  // Fluid - Deposit GHO
  allowAction.fluid.deposit({ targets: ["GHO"] }),
  // Fluid - Deposit sUSDS
  allowAction.fluid.deposit({ targets: ["sUSDS"] }),
  // Fluid - Deposit USDC
  allowAction.fluid.deposit({ targets: ["USDC"] }),
  // Fluid - Deposit wstETH
  allowAction.fluid.deposit({ targets: ["wstETH"] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One - MEV Max
  allowAction.stakewise_v3.stake({ targets: ["Chorus One - MEV Max"] }),
]
