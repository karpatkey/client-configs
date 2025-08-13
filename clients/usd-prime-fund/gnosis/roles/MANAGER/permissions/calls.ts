import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDCe } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.deposit(),

    /*********************************************
     * Bridges
     *********************************************/
    // XDAI (Gnosis) -> USDS (Mainnet) - Gnosis Bridge
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
    // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.

    // USDC (Gnosis) -> USDC (Mainnet)
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
    // No claim is required for the USDC bridged from Mainnet via Gnosis Bridge.

    // USDC.e (Gnosis) -> USDC (Mainnet) - stargate
    ...allowErc20Approve([USDCe], [contracts.gnosis.stargate.poolUsdc]),
    allow.gnosis.stargate.poolUsdc.send(
      {
        dstEid: "30101", // Mainnet chain ID
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
  ] satisfies PermissionList
