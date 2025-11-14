import { allow as allowAction } from "defi-kit/base"
import { USDC, MORPHO } from "@/addresses/base"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Protocols
   *********************************************/

  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),

  // Morpho Market - USDC/cbBTC - id: 0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836",
    ],
  }),
  // Morpho Market - USDC/cbETH - id: 0x1c21c59df9db44bf6f645d854ee710a8ca17b479451447e9f56758aee10a2fad
  allowAction.morphoMarkets.deposit({
    targets: [
      "0x1c21c59df9db44bf6f645d854ee710a8ca17b479451447e9f56758aee10a2fad",
    ],
  }),
  // Morpho Market - USDC/PT-USDe-11DEC2025 - id: 0xafa2d80fcc3aa58419dd8c62b57087384bc35de27d70de9c91525276f2b2fd6e
  allowAction.morphoMarkets.deposit({
    targets: [
      "0xafa2d80fcc3aa58419dd8c62b57087384bc35de27d70de9c91525276f2b2fd6e",
    ],
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

  // CowSwap - [MORPHO] -> [USDC]
  allowAction.cowswap.swap({
    sell: [MORPHO],
    buy: [USDC],
  }),
]
