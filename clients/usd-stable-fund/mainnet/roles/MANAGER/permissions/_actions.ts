import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, USDC } from "@/addresses/eth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

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

  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Borrow DAI
  allowAction.spark.borrow({ targets: ["DAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),
]
