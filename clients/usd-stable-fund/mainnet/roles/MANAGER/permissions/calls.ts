import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { COMP, DAI, USDC, WBTC, wstETH } from "@/addresses/eth"
import { DAI as DAI_opt, COMP as COMP_opt } from "@/addresses/oeth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Compound v3 - Deposit USDC
    allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
    allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
    allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),
    // Compound v3 - Claim rewards
    allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

    // Sky - DSR (DAI Savings Rate)
    // The DsrManager provides an easy to use smart contract that allows
    // service providers to deposit/withdraw dai into the DSR contract pot,
    // and activate/deactivate the Dai Savings Rate to start earning savings
    // on a pool of dai in a single function call.
    // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
    allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
    allow.mainnet.sky.dsrManager.join(c.avatar),
    allow.mainnet.sky.dsrManager.exit(c.avatar),
    allow.mainnet.sky.dsrManager.exitAll(c.avatar),

    /*********************************************
     * Swaps
     *********************************************/
    // Curve - DAI <-> USDC
    allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.x3CrvPool]),
    allow.mainnet.curve.x3CrvPool.exchange(
      c.or(0, 1), // 0 = DAI, 1 = USDC
      c.or(0, 1)
    ),

    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, c.avatar),
    // Claim bridged XDAI from Gnosis
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.executeSignatures(
      c.and(
        // Avatar address
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes corresponding to the amount
        // skip 32 bytes corresponding to the nonce
        // Recipient address: xDai Bridge
        c.bitmask({
          shift: 20 + 32 + 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the xDai Bridge
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the xDai Bridge
        })
      )
    ),
    // DAI - HOP
    allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      100, // Gnosis
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // // COMP (Mainnet) -> COMP (Gnosis)
    // allowErc20Approve([COMP], [contracts.mainnet.gnoOmnibridge]),
    // allow.mainnet.gnoOmnibridge["relayTokens(address,address,uint256)"](
    //   COMP,
    //   c.avatar
    // ),
    // // Claim bridged COMP from Gnosis
    // allow.mainnet.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
    //   c.and(
    //     // messageId: 32 bytes
    //     // First 4 bytes
    //     c.bitmask({
    //       shift: 0,
    //       mask: "0xffffffff",
    //       value: "0x00050000",
    //     }),
    //     // Next 10 bytes
    //     c.bitmask({
    //       shift: 4,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0xa7823d6f1e31569f5186",
    //     }),
    //     // Next 10 bytes
    //     c.bitmask({
    //       shift: 4 + 10,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0x1e345b30c6bebf70ebe7",
    //     }),
    //     // skip last 8 bytes (nonce)
    //     // sender: 20 bytes
    //     c.bitmask({
    //       shift: 32,
    //       mask: "0xffffffffffffffffffff",
    //       value: contracts.gnosis.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
    //     }),
    //     c.bitmask({
    //       shift: 32 + 10,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0x" + contracts.gnosis.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
    //     }),
    //     // executor: 20 bytes
    //     c.bitmask({
    //       shift: 32 + 20,
    //       mask: "0xffffffffffffffffffff",
    //       value: contracts.mainnet.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
    //     }),
    //     c.bitmask({
    //       shift: 32 + 20 + 10,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0x" + contracts.mainnet.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
    //     }),
    //     // gasLimit: 4 bytes
    //     c.bitmask({
    //       shift: 32 + 20 + 20,
    //       mask: "0xffffffff",
    //       value: "0x000927c0",
    //     }),
    //     // dataType + chainIds: 5 bytes
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4,
    //       mask: "0xffffffffff",
    //       value: "0x0101806401",
    //     }),
    //     // selector (handleNativeTokens): 4 bytes
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4 + 5,
    //       mask: "0xffffffff",
    //       value: "0x272255bb",
    //     }),
    //     // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
    //     // Token address
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
    //       mask: "0xffffffffffffffffffff",
    //       value: COMP.slice(0, 22), // First 10 bytes of the token address
    //     }),
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0x" + COMP.slice(22, 42), // Last 10 bytes of the token address
    //     }),
    //     // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
    //     // Avatar address
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
    //       mask: "0xffffffffffffffffffff",
    //       value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
    //     }),
    //     c.bitmask({
    //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
    //       mask: "0xffffffffffffffffffff",
    //       value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
    //     })
    //   )
    // ),

    // USDC -> USDC.e - Gnosis Bridge
    allowErc20Approve([USDC], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
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
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
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
    // HOP does not work with USDC and USDC.e

    // Mainnet -> Optimism
    // DAI - Superbridge
    allowErc20Approve([DAI], [contracts.mainnet.optimismBridge.optDaiBridge]),
    allow.mainnet.optimismBridge.optDaiBridge.depositERC20(
      DAI,
      DAI_opt,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.optimismBridge.optDaiBridge.depositERC20To(
      DAI,
      DAI_opt,
      c.avatar,
      undefined,
      undefined,
      c.or("0x", "0x7375706572627269646765")
    ),
    // DAI - HOP
    allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      10, // Optimism
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP - Superbridge
    allowErc20Approve([COMP], [contracts.mainnet.optimismBridge.optGateway]),
    allow.mainnet.optimismBridge.optGateway.depositERC20(
      COMP,
      COMP_opt,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.optimismBridge.optGateway.depositERC20To(
      COMP,
      COMP_opt,
      c.avatar,
      undefined,
      undefined,
      c.or("0x", "0x7375706572627269646765")
    ),

    // USDC - HOP
    allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      10, // Optimism
      c.avatar
    ),

    // Mainnet -> Arbitrum
    // DAI - Arbitrum Bridge
    allowErc20Approve([DAI], [contracts.mainnet.arbitrumBridge.arbDaiGateway]),
    // arbL1GatewayRouter->getGateway(_token) -> contracts.mainnet.arbDaiGateway
    // https://etherscan.io/address/0xD3B5b60020504bc3489D6949d545893982BA3011#code#F1#L160
    allow.mainnet.arbitrumBridge.arbL1GatewayRouter.outboundTransfer(
      DAI,
      c.avatar,
      undefined,
      undefined,
      undefined,
      c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"]),
      {
        send: true,
      }
    ),
    // DAI - HOP
    allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      42161, // Arbitrum
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP - Arbitrum Bridge
    allowErc20Approve(
      [COMP],
      [contracts.mainnet.arbitrumBridge.arbErc20Gateway]
    ),
    allow.mainnet.arbitrumBridge.arbErc20Gateway.outboundTransfer(
      COMP,
      c.avatar
    ),

    // Mainnet -> Base
    // USDC - HOP
    allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      8453, // Base
      c.avatar
    ),
  ] satisfies PermissionList
