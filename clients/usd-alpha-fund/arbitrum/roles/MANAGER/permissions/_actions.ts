import { allow as allowAction } from "defi-kit/arb1"
import { AURA, BAL, GHO, MORPHO, syrupUSDC, USDC, USDT } from "@/addresses/arb1"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit GHO
  allowAction.aave_v3.deposit({ targets: ["GHO"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),

  // Morpho Market - USDC/sUSDS - id: 0x77fe2f7c2dd6f4da6bc5f445b06052ff8df55cb70cfce9afc16ec3c69a5fd3a3
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x77fe2f7c2dd6f4da6bc5f445b06052ff8df55cb70cfce9afc16ec3c69a5fd3a3",
    ],
  }),
  // Morpho Market - USDC/syrupUSDC - id: 0xf86f3edd6f16cd8211f4d206866dc4ecd41be6211063ac11f8508e1b7112ef40
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xf86f3edd6f16cd8211f4d206866dc4ecd41be6211063ac11f8508e1b7112ef40",
    ],
  }),
  allowAction.morphoMarkets.borrow({
    targets: [
      "0xf86f3edd6f16cd8211f4d206866dc4ecd41be6211063ac11f8508e1b7112ef40",
    ],
  }),

  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0x2C609d9CfC9dda2dB5C128B2a665D921ec53579d"],
  }),

  /*********************************************
   * Bridges
   *********************************************/

  // Circle v2 - Bridge USDC to Mainnet
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Mainnet
  allowAction.circle_v2.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  /*********************************************
   * Swaps
   *********************************************/

  // CowSwap - [AURA, BAL, GHO, MORPHO, syrupUSDC, USDC, USDT] <-> [GHO, syrupUSDC, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [AURA, BAL, GHO, MORPHO, syrupUSDC, USDC, USDT],
    buy: [GHO, syrupUSDC, USDC, USDT],
  }),
]
