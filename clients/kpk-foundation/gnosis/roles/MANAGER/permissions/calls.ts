import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowEthTransfer } from "@/helpers"
import { kpkFoundationEth, kpkGc } from "../../../../addresses"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // Gnosis -> Mainnet
  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(kpkFoundationEth, {
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 500K XDAI per month to kpkGc
  allowEthTransfer(kpkGc, "XDAI_KPK-GNO"),
] satisfies PermissionList
