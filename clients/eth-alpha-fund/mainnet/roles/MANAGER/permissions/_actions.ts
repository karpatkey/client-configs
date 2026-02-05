import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  ETHPlus,
  ezETH,
  GEAR,
  KING,
  MORPHO,
  rETH,
  RPL,
  rsETH,
  stETH,
  USDC,
  weETH,
  WETH,
  wstETH,
  gearbox,
  morpho,
} from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 Core Market - Deposit ezETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ezETH"] }),
  // Aave v3 Core Market - Deposit rETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rETH"] }),
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

  // CowSwap - [AURA, BAL, ETHPlus, ezETH, GEAR, KING, MORPHO, rETH, RPL, rsETH, stETH, USDC, weETH, WETH, wstETH] ->
  // [ETHPlus, ezETH, rETH, rsETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      AURA,
      BAL,
      ETHPlus,
      ezETH,
      GEAR,
      KING,
      MORPHO,
      rETH,
      RPL,
      rsETH,
      stETH,
      USDC,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [ETHPlus, ezETH, rETH, rsETH, stETH, weETH, WETH, wstETH],
  }),

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

  // Morpho Market - Deposit WETH/ETH+ - id: 0x5f8a138ba332398a9116910f4d5e5dcd9b207024c5290ce5bc87bc2dbd8e4a86
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x5f8a138ba332398a9116910f4d5e5dcd9b207024c5290ce5bc87bc2dbd8e4a86",
    ],
  }),
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
  // Morpho Market - Deposit WETH/rsETH - id: 0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942",
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
    targets: [morpho.kpkEthPrimeV1],
  }),
  // Morpho Vault - kpk ETH Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkEthPrimeV2],
  }),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),
]
