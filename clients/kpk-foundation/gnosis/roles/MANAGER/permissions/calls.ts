import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Approve } from "@/helpers"
import { USDC, USDCe } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { kpkFoundationEth } from "../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Swaps
   *********************************************/
  // Swap USDC.e -> USDC
  allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  allowErc20Approve([USDC], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // Gnosis -> Mainnet
  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(kpkFoundationEth, {
    send: true,
  }),
  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    kpkFoundationEth
  ),
] satisfies PermissionList
