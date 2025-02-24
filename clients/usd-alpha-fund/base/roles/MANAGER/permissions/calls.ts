import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, cbETH, morpho } from "@/addresses/base"
import { USDC as USDC_eth } from "@/addresses/eth"
import { USDC as USDC_arb1 } from "@/addresses/arb1"
import { USDC as USDC_oeth } from "@/addresses/oeth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Morpho Blue - cbETH/USDC
    ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: cbETH,
        oracle: morpho.oracleCbEthUsdc,
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
        collateralToken: cbETH,
        oracle: morpho.oracleCbEthUsdc,
        irm: morpho.adaptativeCurveIrm,
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.base.navCalculator.bridgeStart(),

    // Base -> Mainnet
    // USDC (Base) -> USDC (Mainnet)
    ...allowErc20Approve([USDC], [contracts.base.circleTokenMessenger]),
    allow.base.circleTokenMessenger.depositForBurn(
      undefined,
      0,
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      USDC
    ),
    // Claim bridged USDC from Mainnet
    allow.base.circleMessageTransmitter.receiveMessage(
      c.and(
        // version: 4 bytes (00000000)
        // source domain: 4 bytes (00000000)
        // destination domain: 4 bytes (00000006)
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffffffff",
          value: "0x000000000000000000000006",
        }),
        // skip nonce 8 bytes
        // sender: 32 bytes
        // skip the first 12 bytes of the address with 0's
        // Circle Token Messenger (Mainnet)
        c.bitmask({
          shift: 20 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.mainnet.circleTokenMessenger.slice(22, 42),
        }),
        // recipient: 32 bytes
        // Circle Token Messenger (Base)
        c.bitmask({
          shift: 20 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.base.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.base.circleTokenMessenger.slice(22, 42),
        }),
        // message body: dynamic
        // skip selector (4 bytes) + 32 bytes chunk with 0
        // Bridged Token: USDC
        // skip the first 12 bytes of the address with 0's
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC_eth.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC_eth.slice(22, 42),
        }),
        // Avatar address
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes chunk with 0
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
    // USDC (Base) -> USDC (Mainnet) - HOP
    ...allowErc20Approve([USDC], [contracts.base.l2HopCctp]),
    allow.base.l2HopCctp.send(
      1, // Mainnet
      c.avatar
    ),

    // USDC (Base) -> USDC (Arbitrum)
    ...allowErc20Approve([USDC], [contracts.base.circleTokenMessenger]),
    allow.base.circleTokenMessenger.depositForBurn(
      undefined,
      3,
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      USDC
    ),
    // Claim bridged USDC from Arbitrum
    allow.base.circleMessageTransmitter.receiveMessage(
      c.and(
        // version: 4 bytes (00000000)
        // source domain: 4 bytes (00000003)
        // destination domain: 4 bytes (00000006)
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffffffff",
          value: "0x000000000000000300000006",
        }),
        // skip nonce 8 bytes
        // sender: 32 bytes
        // skip the first 12 bytes of the address with 0's
        // Circle Token Messenger (Arbitrum)
        c.bitmask({
          shift: 20 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.arbitrumOne.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.arbitrumOne.circleTokenMessenger.slice(22, 42),
        }),
        // recipient: 32 bytes
        // Circle Token Messenger (Base)
        c.bitmask({
          shift: 20 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.base.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.base.circleTokenMessenger.slice(22, 42),
        }),
        // message body: dynamic
        // skip selector (4 bytes) + 32 bytes chunk with 0
        // Bridged Token: USDC
        // skip the first 12 bytes of the address with 0's
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC_arb1.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC_arb1.slice(22, 42),
        }),
        // Avatar address
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes chunk with 0
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // USDC (Base) -> USDC (Optimism)
    ...allowErc20Approve([USDC], [contracts.base.circleTokenMessenger]),
    allow.base.circleTokenMessenger.depositForBurn(
      undefined,
      2,
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      USDC
    ),
    // Claim bridged USDC from Optimism
    allow.base.circleMessageTransmitter.receiveMessage(
      c.and(
        // version: 4 bytes (00000000)
        // source domain: 4 bytes (00000002)
        // destination domain: 4 bytes (00000006)
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffffffff",
          value: "0x000000000000000200000006",
        }),
        // skip nonce 8 bytes
        // sender: 32 bytes
        // skip the first 12 bytes of the address with 0's
        // Circle Token Messenger (Optimism)
        c.bitmask({
          shift: 20 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.optimism.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.optimism.circleTokenMessenger.slice(22, 42),
        }),
        // recipient: 32 bytes
        // Circle Token Messenger (Base)
        c.bitmask({
          shift: 20 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.base.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.base.circleTokenMessenger.slice(22, 42),
        }),
        // message body: dynamic
        // skip selector (4 bytes) + 32 bytes chunk with 0
        // Bridged Token: USDC
        // skip the first 12 bytes of the address with 0's
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC_oeth.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC_oeth.slice(22, 42),
        }),
        // Avatar address
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes chunk with 0
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
  ] satisfies PermissionList
