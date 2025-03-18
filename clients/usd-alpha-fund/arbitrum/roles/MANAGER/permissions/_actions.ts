import { allow as allowAction } from "defi-kit/arb1"
import { COMP, DAI, USDC, USDCe } from "@/addresses/arb1"
import { parameters } from "../../../instances/main"

export default [
  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit GHO
  allowAction.aave_v3.deposit({ targets: ["GHO"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
  // Aave v3 - Deposit USDT
  allowAction.aave_v3.deposit({ targets: ["USD₮0"] }),

  // Circle v1 - Bridge USDC to Base
  allowAction.circle_v1.bridge({
    targets: ["Base"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Base
  allowAction.circle_v1.receive({
    targets: ["Base"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Circle v1 - Bridge USDC to Ethereum
  allowAction.circle_v1.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Ethereum
  allowAction.circle_v1.receive({
    targets: ["Ethereum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // Circle v1 - Bridge USDC to Optimism
  allowAction.circle_v1.bridge({
    targets: ["Optimism"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Optimism
  allowAction.circle_v1.receive({
    targets: ["Optimism"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // CowSwap - [COMP, DAI, USDC, USDCe] -> [DAI, USDC, USDCe]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, USDC, USDCe],
    buy: [DAI, USDC, USDCe],
  }),
]
