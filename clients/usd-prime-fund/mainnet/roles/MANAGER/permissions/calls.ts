import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  cbBTC,
  GHO,
  morpho,
  pendle,
  sUSDS,
  USDC,
  USDS,
  USDT,
  WBTC,
  wstETH,
  wstUSR,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Protocols
     *********************************************/

    // ACI - Claim Merit Rewards through Merkle (max 2 tokens: USDS and stkGHO)
    allow.mainnet.merkl.angleDistributor.claim(
      c.or([parameters.avatar], [parameters.avatar, parameters.avatar])
    ),

    // Morpho Blue - wstETH/USDC
    ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: wstETH,
        oracle: morpho.oracleWstEthUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),
    // Morpho Blue - sUSDS/USDT
    ...allowErc20Approve([sUSDS, USDT], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDT,
        collateralToken: sUSDS,
        oracle: morpho.oracleSusdsUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "965000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDT,
        collateralToken: sUSDS,
        oracle: morpho.oracleSusdsUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "965000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Morpho Blue - cbBTC/USDC
    ...allowErc20Approve([cbBTC, USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: cbBTC,
        oracle: morpho.oracleCbbtcUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: cbBTC,
        oracle: morpho.oracleCbbtcUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Morpho Blue - PT-USDe-25SEP2025/USDC
    ...allowErc20Approve(
      [pendle.ptUSDe25SEP2025, USDC],
      [contracts.mainnet.morpho.morphoBlue]
    ),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: pendle.ptUSDe25SEP2025,
        oracle: morpho.oraclePTUsde25Sep2025Usdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: pendle.ptUSDe25SEP2025,
        oracle: morpho.oraclePTUsde25Sep2025Usdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Morpho Blue - PT-USDe-25SEP2025/USDT
    ...allowErc20Approve(
      [pendle.ptUSDe25SEP2025, USDT],
      [contracts.mainnet.morpho.morphoBlue]
    ),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDT,
        collateralToken: pendle.ptUSDe25SEP2025,
        oracle: morpho.oraclePTUsde25Sep2025Usdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDT,
        collateralToken: pendle.ptUSDe25SEP2025,
        oracle: morpho.oraclePTUsde25Sep2025Usdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Morpho Blue - wstUSR/USDC
    ...allowErc20Approve([wstUSR, USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: wstUSR,
        oracle: morpho.oraclewstUSRUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: wstUSR,
        oracle: morpho.oraclewstUSRUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    /*********************************************
     * Bridges
     *********************************************/
    // Mainnet -> Gnosis
    // USDS -> XDAI - Gnosis Bridge
    ...allowErc20Approve(
      [USDS],
      [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]
    ),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(USDS, c.avatar),
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

    // USDC -> USDC.e - Gnosis Bridge
    ...allowErc20Approve(
      [USDC],
      [contracts.mainnet.gnosisBridge.gnoOmnibridge]
    ),
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

    // USDC - Stargate to Gnosis Chain
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30145", // Gnosis Chain ID
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

    // Mainnet -> Arbitrum
    // USDC - Stargate to Arbitrum
    ...allowErc20Approve([USDC], [contracts.mainnet.stargate.poolUsdc]),
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30110", // Arbitrum chain ID
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

    // USDT - Stargate to Arbitrum
    {
      ...allow.mainnet.stargate.poolUsdc.send(
        {
          dstEid: "30110", // Arbitrum chain ID
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
      targetAddress: contracts.mainnet.stargate.poolUsdt,
    },

    // Mainnet -> Base
    // USDC - Stargate to Base
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30184", // Base chain ID
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

    // Mainnet -> Optimism
    // USDC - Stargate to Optimism
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30111", // Optimism chain ID
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

    // USDT - Stargate to Optimism
    ...allowErc20Approve([USDT], [contracts.mainnet.stargate.poolUsdt]),
    {
      ...allow.mainnet.stargate.poolUsdc.send(
        {
          dstEid: "30111", // Optimism chain ID
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
      targetAddress: contracts.mainnet.stargate.poolUsdt,
    },
  ] satisfies PermissionList
