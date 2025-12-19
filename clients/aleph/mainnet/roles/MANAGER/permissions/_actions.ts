import { allow as allowAction } from "defi-kit/eth"
import {
  ETHPlus,
  ezETH,
  GEAR,
  MORPHO,
  rETH,
  rsETH,
  stETH,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 Core Market - Deposit rsETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rsETH"] }),
  // Aave v3 Core Market - Deposit weETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["weETH"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 Core Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),

  // Aave v3 Core Market - Borrow WETH
  allowAction.aave_v3.borrow({ market: "Core", targets: ["WETH"] }),

  // Aave v3 Prime Market - Deposit ezETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["ezETH"] }),
  // Aave v3 Prime Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["WETH"] }),
  // Aave v3 Prime Market - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Prime", targets: ["wstETH"] }),

  // Aave v3 Prime Market - Borrow WETH
  allowAction.aave_v3.borrow({ market: "Prime", targets: ["WETH"] }),
  // Aave v3 Prime Market - Borrow wstETH
  allowAction.aave_v3.borrow({ market: "Prime", targets: ["wstETH"] }),

  // CowSwap - [ETHPlus, ezETH, GEAR, MORPHO, rETH, rsETH, stETH, weETH, WETH, wstETH] <->
  // [ETHPlus, ezETH, GEAR, MORPHO, ETH, rsETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      ETHPlus,
      ezETH,
      GEAR,
      MORPHO,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      ETHPlus,
      ezETH,
      GEAR,
      MORPHO,
      rETH,
      rsETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Morpho Market - Deposit WETH/wstETH - id: 0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
    ],
  }),
  // Morpho Market - Deposit weETH/WETH - id: 0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7",
    ],
  }),

  // Morpho Market - Borrow WETH/wstETH - id: 0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e
  allowAction.morphoMarkets.borrow({
    targets: [
      "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
    ],
  }),
  // Morpho Market - Borrow weETH/WETH - id: 0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7
  allowAction.morphoMarkets.borrow({
    targets: [
      "0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7",
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

  // Rocket Pool
  allowAction.rocket_pool.deposit(),
]
