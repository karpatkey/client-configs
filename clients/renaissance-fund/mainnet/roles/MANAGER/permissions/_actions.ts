import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  BAL,
  CRV,
  GNO,
  LDO,
  LINK,
  PENDLE,
  SKY,
  stkAAVE,
  USDC,
  UNI,
  WETH,
} from "@/addresses/eth"
import { kpkGovernance } from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  // Aave Safety Module - Stake AAVE
  allowAction.aave_v3.stake({ targets: ["AAVE"] }),
  // Aave v3 - Delegate AAVE to governance.karpatkey.eth
  allowAction.aave_v3.delegate({ targets: ["AAVE"], delegatee: kpkGovernance }),
  // Aave v3 - Revoke AAVE delegation
  allowAction.aave_v3.delegate({
    targets: ["AAVE"],
    delegatee: parameters.avatar,
  }),
  // Aave v3 - Delegate stkAAVE to governance.karpatkey.eth
  allowAction.aave_v3.delegate({
    targets: ["stkAAVE"],
    delegatee: kpkGovernance,
  }),
  // Aave v3 - Revoke stkAAVE delegation
  allowAction.aave_v3.delegate({
    targets: ["stkAAVE"],
    delegatee: parameters.avatar,
  }),

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

  // Circle v2 - Bridge USDC to Arbitrum
  allowAction.circle_v2.bridge({
    targets: ["Arbitrum"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Arbitrum
  allowAction.circle_v2.receive({
    targets: ["Arbitrum"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),
  // Circle v2 - Bridge USDC to Base
  allowAction.circle_v2.bridge({
    targets: ["Base"],
    recipient: parameters.avatar,
  }),
  // Circle v2 - Receive USDC from Base
  allowAction.circle_v2.receive({
    targets: ["Base"],
    sender: parameters.avatar,
    recipient: parameters.avatar,
  }),

  // CowSwap - [AAVE, BAL, CRV, ETH, GNO, LDO, LINK, PENDLE, SKY, stkAAVE, USDC, UNI, WETH] <->
  // [AAVE, BAL, CRV, ETH, GNO, LDO, LINK, PENDLE, SKY, stkAAVE, USDC, UNI, WETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      AAVE,
      BAL,
      CRV,
      GNO,
      LDO,
      LINK,
      PENDLE,
      SKY,
      stkAAVE,
      USDC,
      UNI,
      WETH,
    ],
    buy: [
      "ETH",
      AAVE,
      BAL,
      CRV,
      GNO,
      LDO,
      LINK,
      PENDLE,
      SKY,
      stkAAVE,
      USDC,
      UNI,
      WETH,
    ],
  }),
]
