import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  ETHx,
  ezETH,
  FLUID,
  GEAR,
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
  WBTC,
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

  // CowSwap - [FLUID, GEAR, KING, MORPHO, SD] -> [USDC]
  allowAction.cowswap.swap({
    sell: [FLUID, GEAR, KING, MORPHO, SD],
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

  // CowSwap - WBTC <-> WETH
  allowAction.cowswap.swap({
    sell: [WBTC, WETH],
    buy: [WBTC, WETH],
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

  // Morpho Vault - Gauntlet WETH Prime v1
  allowAction.morphoVaults.deposit({
    targets: ["0x2371e134e3455e0593363cBF89d3b6cf53740618"],
  }),
  // Morpho Vault - kpk ETH v2
  allowAction.morphoVaults.deposit({
    targets: ["0xBb50A5341368751024ddf33385BA8cf61fE65FF9"],
  }),
  // Morpho Vault - kpk USDC v2
  allowAction.morphoVaults.deposit({
    targets: ["0x4Ef53d2cAa51C447fdFEEedee8F07FD1962C9ee6"],
  }),
  // Morpho Vault - MEV Capital wETH v1
  allowAction.morphoVaults.deposit({
    targets: ["0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8"],
  }),
  // Morpho Vault - Re7 WETH v1
  allowAction.morphoVaults.deposit({
    targets: ["0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0"],
  }),
  // Morpho Vault - Smokehouse USDC v1
  allowAction.morphoVaults.deposit({
    targets: ["0xBEeFFF209270748ddd194831b3fa287a5386f5bC"],
  }),
  // Morpho Vault - Steakhouse ETH v1
  allowAction.morphoVaults.deposit({
    targets: ["0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4"],
  }),
  // Morpho Vault - Steakhouse USDC v1
  allowAction.morphoVaults.deposit({
    targets: ["0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"],
  }),
  // Morpho Vault - Usual Boosted USDC v1
  allowAction.morphoVaults.deposit({
    targets: ["0xd63070114470f685b75B74D60EEc7c1113d33a3D"],
  }),
  // Morpho Vault - Vault Bridge WETH v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0x31A5684983EeE865d943A696AAC155363bA024f9"],
  }),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  // StakeWise v3 - Chorus One - MEV Max
  allowAction.stakewise_v3.stake({ targets: ["Chorus One - MEV Max"] }),
]
