import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
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
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"
import {
  avatar,
  kpkGovernance,
  snapshotCowId,
  snapshotLidoId,
  snapshotSafeId,
} from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
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

  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  // CowSwap - [1INCH, AAVE, BAL, COW, CRV, DAI, DYDX, ENA, GHO, GNO, LDO, LINK, MKR, ONDO, PENDLE, PYTH, RPL, SAFE, SKY, sUSDS, stkAAVE, stkGHO, USDC, USDS, USDT, UNI] <->
  // [1INCH, AAVE, BAL, COW, CRV, DAI, DYDX, ENA, GHO, GNO, LDO, LINK, MKR, ONDO, PENDLE, PYTH, RPL, SAFE, SKY, sUSDS, stkAAVE, stkGHO, USDC, USDS, USDT, UNI]
  allowAction.cowswap.swap({
    sell: [
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
    ],
    buy: [
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
    ],
  }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Cow - Delegate/Undelgate COW on Snapshot
  allow.mainnet.snapshot.delegation.setDelegate(snapshotCowId, kpkGovernance),
  allow.mainnet.snapshot.delegation.clearDelegate(snapshotCowId),

  // Lido - Delegate/Undelgate LDO on Snapshot
  allow.mainnet.snapshot.delegation.setDelegate(snapshotLidoId, kpkGovernance),
  allow.mainnet.snapshot.delegation.clearDelegate(snapshotLidoId),

  // Lido - Delegate/Undelgate LDO on Aragon
  allow.mainnet.lido.aragonVoting.assignDelegate(kpkGovernance),
  allow.mainnet.lido.aragonVoting.unassignDelegate(),

  // Safe - Delegate/Undelgate SAFE on Snapshot
  allow.mainnet.snapshot.delegation.setDelegate(snapshotSafeId, kpkGovernance),
  allow.mainnet.snapshot.delegation.clearDelegate(snapshotSafeId),

  // Uniswap - Delegate/Undelgate UNI on Tally
  allow.mainnet.uniswapV3.uni.delegate(c.or(kpkGovernance, avatar)),

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.mainnet.navCalculator.bridgeStart(),

  // Mainnet -> Gnosis
  // DAI -> XDAI
  ...allowErc20Approve([DAI], [contracts.mainnet.gnoXdaiBridge]),
  allow.mainnet.gnoXdaiBridge.relayTokens(c.avatar, undefined),
  // Claim bridged XDAI from Gnosis
  allow.mainnet.gnoXdaiBridge.executeSignatures(
    c.and(
      // Avatar address
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes corresponding to the amount
      // skip 32 bytes corresponding to the txHash from Gnosis
      // Recipient address: Gnosis Chain xDai Bridge
      c.bitmask({
        shift: 20 + 32 + 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),

  // USDC (Mainnet) -> USDC.e (Gnosis)
  ...allowErc20Approve([USDC], [contracts.mainnet.gnoOmnibridge]),
  allow.mainnet.gnoOmnibridge.relayTokensAndCall(
    USDC,
    contracts.gnosis.usdcTransmuter,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0")
  ),
  // Claim bridged USDC from Gnosis
  allow.mainnet.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
    c.and(
      // messageId: 32 bytes
      // First 4 bytes
      c.bitmask({
        shift: 0,
        mask: "0xffffffff",
        value: "0x00050000",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4,
        mask: "0xffffffffffffffffffff",
        value: "0xa7823d6f1e31569f5186",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x1e345b30c6bebf70ebe7",
      }),
      // skip last 8 bytes (nonce)
      // sender: 20 bytes
      c.bitmask({
        shift: 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.gnosis.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
      }),
      // gasLimit: 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20,
        mask: "0xffffffff",
        value: "0x000927c0",
      }),
      // dataType + chainIds: 5 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4,
        mask: "0xffffffffff",
        value: "0x0101806401",
      }),
      // selector (handleNativeTokens): 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5,
        mask: "0xffffffff",
        value: "0x272255bb",
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Token address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC.slice(22, 42), // Last 10 bytes of the token address
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),

  // GNO (Mainnet) -> GNO (Gnosis)
  ...allowErc20Approve([GNO], [contracts.mainnet.gnoOmnibridge]),
  allow.mainnet.gnoOmnibridge["relayTokens(address,address,uint256)"](
    GNO,
    c.avatar
  ),

  // Claim bridged GNO from Gnosis
  allow.mainnet.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
    c.and(
      // messageId: 32 bytes
      // First 4 bytes
      c.bitmask({
        shift: 0,
        mask: "0xffffffff",
        value: "0x00050000",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4,
        mask: "0xffffffffffffffffffff",
        value: "0xa7823d6f1e31569f5186",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x1e345b30c6bebf70ebe7",
      }),
      // skip last 8 bytes (nonce)
      // sender: 20 bytes
      c.bitmask({
        shift: 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.gnosis.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
      }),
      // gasLimit: 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20,
        mask: "0xffffffff",
        value: "0x000927c0",
      }),
      // dataType + chainIds: 5 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4,
        mask: "0xffffffffff",
        value: "0x0101806401",
      }),
      // selector (handleNativeTokens): 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5,
        mask: "0xffffffff",
        value: "0x272255bb",
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Token address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
        mask: "0xffffffffffffffffffff",
        value: GNO.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + GNO.slice(22, 42), // Last 10 bytes of the token address
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),

  // Mainnet -> Arbitrum
  // USDC (Mainnet) -> USDC (Arbitrum) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
  allow.mainnet.l1HopCctp.send(
    42161, // Arbitrum
    c.avatar
  ),
] satisfies PermissionList
