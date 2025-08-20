import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { kpkGovernance, snapshotLidoId } from "../../../../mainnet/addresses"
import { Parameters } from "../../../../mainnet/parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave Merit rewards (https://apps.aavechan.com/merit)
    allow.mainnet.aaveV3.meritDistributor.claim([parameters.avatar]),

    // Lido - Delegate/Undelgate LDO on Snapshot
    allow.mainnet.snapshot.delegation.setDelegate(
      snapshotLidoId,
      kpkGovernance
    ),
    allow.mainnet.snapshot.delegation.clearDelegate(snapshotLidoId),

    // Lido - Delegate/Undelgate LDO on Aragon
    allow.mainnet.lido.aragonVoting.assignDelegate(kpkGovernance),
    allow.mainnet.lido.aragonVoting.unassignDelegate(),

    // Uniswap - Delegate/Undelgate UNI on Tally
    allow.mainnet.uniswap.uni.delegate(c.or(kpkGovernance, c.avatar)),

    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Gnosis
    // USDC -> USDC.e - Gnosis Bridge
    ...allowErc20Approve([USDC], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.gnosisBridge.usdcTransmuter,
      undefined,
      "0x" + parameters.avatar.slice(2).padStart(64, "0")
    ),
    // Claim bridged USDC from Gnosis
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
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
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
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
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // Mainnet -> Arbitrum
    // ETH - Arbitrum Bridge
    allow.mainnet.arbitrumBridge.delayedInbox.createRetryableTicket(
      c.avatar, // Destination address
      undefined,
      undefined,
      c.avatar, // Origin address
      c.avatar, // Destination address
      undefined,
      undefined,
      "0x",
      {
        send: true,
      }
    ),
    // Claim bridged ETH from Arbitrum
    allow.mainnet.arbitrumBridge.outbox4.executeTransaction(
      undefined,
      undefined,
      c.avatar, // Origin address
      c.avatar, // Destination address
      undefined,
      undefined,
      undefined,
      undefined,
      "0x"
    ),

    // ETH - Stargate
    allow.mainnet.stargate.poolNative.send(
      {
        dstEid: "30110", // Arbitrum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),

    // USDC - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      42161, // Arbitrum
      c.avatar
    ),
  ] satisfies PermissionList
