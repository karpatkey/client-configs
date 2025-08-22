import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { DAI, USDC } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { kfPaymentsEth } from "../../../../../kpk-dao/mainnet/addresses"
import { kpkFoundationGc, fundReapGeneralEth } from "../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    /*********************************************
     * Bridging
     *********************************************/
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    ...allowErc20Approve(
      [DAI],
      [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]
    ),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, kpkFoundationGc),
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

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer 100K USDC per month to kfPaymentsEth
    allowErc20Transfer([USDC], [kfPaymentsEth], "USDC_KF-PAYMENTS-ETH"),

    // Transfer 100K USDC per month to fundReapGeneralEth
    allowErc20Transfer(
      [USDC],
      [fundReapGeneralEth],
      "USDC_FUND-REAP-GENERAL-ETH"
    ),
  ] satisfies PermissionList
