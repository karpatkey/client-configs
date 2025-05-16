import { allow as allowAction } from "defi-kit/eth"
import {
  _1INCH,
  AAVE,
  BAL,
  COW,
  CRV,
  DAI,
  DYDX,
  ENA,
  GHO,
  GNO,
  LDO,
  LINK,
  MKR,
  ONDO,
  PENDLE,
  PYTH,
  RPL,
  SAFE,
  SKY,
  sUSDS,
  stkAAVE,
  stkGHO,
  USDC,
  USDS,
  USDT,
  UNI,
  WETH,
} from "@/addresses/eth"
import { kpkGovernance } from "../../../../mainnet/addresses"
import { parameters } from "../../../instances/main"

export default [
  // Aave Safety Module - Stake AAVE
  allowAction.aave_v3.stake({ targets: ["AAVE"] }),
  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),
  // Aave v3 - Delegate AAVE to governance.karpatkey.eth
  allowAction.aave_v3.delegate({ targets: ["AAVE"], delegatee: kpkGovernance }),
  // Aave v3 - Delegate stkAAVE to governance.karpatkey.eth
  allowAction.aave_v3.delegate({
    targets: ["stkAAVE"],
    delegatee: kpkGovernance,
  }),
  // Aave v3 - Delegate aAAVE to governance.karpatkey.eth
  allowAction.aave_v3.delegate({
    targets: ["aEthAAVE"],
    delegatee: kpkGovernance,
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

  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  // CowSwap - [1INCH, AAVE, BAL, COW, CRV, DAI, DYDX, ENA, ETH, GHO, GNO, LDO, LINK, MKR, ONDO, PENDLE, PYTH, RPL, SAFE, SKY, sUSDS, stkAAVE, stkGHO, USDC, USDS, USDT, UNI, WETH] <->
  // [1INCH, AAVE, BAL, COW, CRV, DAI, DYDX, ENA, ETH, GHO, GNO, LDO, LINK, MKR, ONDO, PENDLE, PYTH, RPL, SAFE, SKY, sUSDS, stkAAVE, stkGHO, USDC, USDS, USDT, UNI, WETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      _1INCH,
      AAVE,
      BAL,
      COW,
      CRV,
      DAI,
      DYDX,
      ENA,
      GHO,
      GNO,
      LDO,
      LINK,
      MKR,
      ONDO,
      PENDLE,
      PYTH,
      RPL,
      SAFE,
      SKY,
      sUSDS,
      stkAAVE,
      stkGHO,
      USDC,
      USDS,
      USDT,
      UNI,
      WETH,
    ],
    buy: [
      "ETH",
      _1INCH,
      AAVE,
      BAL,
      COW,
      CRV,
      DAI,
      DYDX,
      ENA,
      GHO,
      GNO,
      LDO,
      LINK,
      MKR,
      ONDO,
      PENDLE,
      PYTH,
      RPL,
      SAFE,
      SKY,
      sUSDS,
      stkAAVE,
      stkGHO,
      USDC,
      USDS,
      USDT,
      UNI,
      WETH,
    ],
  }),
]
