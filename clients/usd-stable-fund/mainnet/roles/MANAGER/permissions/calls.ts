import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { COMP, DAI, USDC, WBTC, wstETH, morpho } from "@/addresses/eth"
import { DAI as DAI_opt, COMP as COMP_opt } from "@/addresses/oeth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Compound v3 - Deposit USDC
    ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
    allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
    allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),
    // Compound v3 - Claim rewards
    allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

    // Morpho Blue - wstETH/USDC
    ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: wstETH,
        oracle: morpho.oracleWstEthUsdc,
        irm: morpho.adaptativeCurveIrm,
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: wstETH,
        oracle: morpho.oracleWstEthUsdc,
        irm: morpho.adaptativeCurveIrm,
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),
    // Morpho Blue - WBTC/USDC
    // USDC approval already included
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: WBTC,
        oracle: morpho.oracleWbtcUsdc,
        irm: morpho.adaptativeCurveIrm,
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: WBTC,
        oracle: morpho.oracleWbtcUsdc,
        irm: morpho.adaptativeCurveIrm,
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Sky - DSR (DAI Savings Rate)
    // The DsrManager provides an easy to use smart contract that allows
    // service providers to deposit/withdraw dai into the DSR contract pot,
    // and activate/deactivate the Dai Savings Rate to start earning savings
    // on a pool of dai in a single function call.
    // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
    ...allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
    allow.mainnet.sky.dsrManager.join(c.avatar),
    allow.mainnet.sky.dsrManager.exit(c.avatar),
    allow.mainnet.sky.dsrManager.exitAll(c.avatar),

    /*********************************************
     * Swaps
     *********************************************/
    // Curve - DAI <-> USDC
    ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.x3CrvPool]),
    allow.mainnet.curve.x3CrvPool.exchange(
      c.or(0, 1), // 0 = DAI, 1 = USDC
      c.or(0, 1)
    ),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.mainnet.navCalculator.bridgeStart(),

    // Mainnet -> Gnosis
    // DAI -> XDAI
    ...allowErc20Approve([DAI], [contracts.mainnet.xdaiUsdsBridge]),
    allow.mainnet.xdaiUsdsBridge.relayTokens(DAI, c.avatar),
    // Claim bridged XDAI from Gnosis
    allow.mainnet.xdaiUsdsBridge.executeSignatures(
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
          value: contracts.mainnet.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the xDai Bridge
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.mainnet.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the xDai Bridge
        })
      )
    ),
    // DAI (Mainnet) -> DAI (Gnosis) - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
    allow.mainnet.hopDaiBridge.sendToL2(
      100, // Gnosis
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // // COMP (Mainnet) -> COMP (Gnosis)
    // ...allowErc20Approve([COMP], [contracts.mainnet.gnoOmnibridge]),
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

    // USDC (Mainnet) -> USDC.e (Gnosis)
    ...allowErc20Approve([USDC], [contracts.mainnet.gnoOmnibridge]),
    allow.mainnet.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.usdcTransmuter,
      undefined,
      "0x" + parameters.avatar.slice(2).padStart(64, "0")
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
    // DAI (Mainnet) -> DAI (Optimism)
    ...allowErc20Approve([DAI], [contracts.mainnet.optDaiBridge]),
    allow.mainnet.optDaiBridge.depositERC20(DAI, DAI_opt),
    allow.mainnet.optDaiBridge.depositERC20To(DAI, DAI_opt, c.avatar),
    // DAI (Mainnet) -> DAI (Optimism) - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
    allow.mainnet.hopDaiBridge.sendToL2(
      10, // Optimism
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP (Mainnet) -> COMP (Optimism)
    ...allowErc20Approve([COMP], [contracts.mainnet.optGateway]),
    allow.mainnet.optGateway.depositERC20(COMP, COMP_opt),
    allow.mainnet.optGateway.depositERC20To(COMP, COMP_opt, c.avatar),

    // USDC (Mainnet) -> USDC (Optimism) - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
    allow.mainnet.l1HopCctp.send(
      10, // Optimism
      c.avatar
    ),

    // Mainnet -> Arbitrum
    // DAI (Mainnet) -> DAI (Arbitrum)
    ...allowErc20Approve([DAI], [contracts.mainnet.arbDaiGateway]),
    allow.mainnet.arbDaiGateway.outboundTransfer(DAI, c.avatar),
    // DAI (Mainnet) -> DAI (Arbitrum) - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
    allow.mainnet.hopDaiBridge.sendToL2(
      42161, // Arbitrum
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP (Mainnet) -> COMP (Arbitrum)
    ...allowErc20Approve([COMP], [contracts.mainnet.arbErc20Gateway]),
    allow.mainnet.arbErc20Gateway.outboundTransfer(COMP, c.avatar),

    // Mainnet -> Base
    // USDC (Mainnet) -> USDC (Base) - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
    allow.mainnet.l1HopCctp.send(
      8453, // Base
      c.avatar
    ),
  ] satisfies PermissionList
