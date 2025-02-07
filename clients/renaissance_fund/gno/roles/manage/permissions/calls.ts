import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDCe } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    /*********************************************
     * Swaps
     *********************************************/
    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.deposit(),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.gnosis.navCalculator.bridgeStart(),

    // Bridge - Gnosis -> Mainnet
    // XDAI (Gnosis) -> DAI (Mainnet)
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // USDC (Gnosis) -> USDC (Mainnet)
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // GNO (Gnosis) -> GNO (Mainnet)
    allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
  ] satisfies PermissionList
