import { allow as allowAction } from "defi-kit/base"
import { parameters } from "../../../instances/main"

export default [
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),

  // Circle v1 - Bridge USDC to Arbitrum
  allowAction.circle_v1.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v1 - Receive USDC from Arbitrum
  allowAction.circle_v1.receive({
    targets: ["Arbitrum"],
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
]
