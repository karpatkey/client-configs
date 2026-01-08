import { allow as allowAction } from "defi-kit/base"
import { cbETH, weETH, WETH, wstETH } from "@/addresses/base"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 - Deposit cbETH
  allowAction.aave_v3.deposit({ targets: ["cbETH"] }),
  // Aave v3 - Deposit weETH
  allowAction.aave_v3.deposit({ targets: ["weETH"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),

  // Aave v3 - Borrow WETH
  allowAction.aave_v3.borrow({ targets: ["WETH"] }),

  // CowSwap - [cbETH, weETH, WETH, wstETH] <-> [cbETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [cbETH, weETH, WETH, wstETH],
    buy: [cbETH, weETH, WETH, wstETH],
  }),

  // Morpho Market - Deposit WETH/wstETH - id: 0x3a4048c64ba1b375330d376b1ce40e4047d03b47ab4d48af484edec9fec801ba
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x3a4048c64ba1b375330d376b1ce40e4047d03b47ab4d48af484edec9fec801ba",
    ],
  }),
  // Morpho Market - Deposit weETH/WETH - id: 0xfd0895ba253889c243bf59bc4b96fd1e06d68631241383947b04d1c293a0cfea
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xfd0895ba253889c243bf59bc4b96fd1e06d68631241383947b04d1c293a0cfea",
    ],
  }),
]
