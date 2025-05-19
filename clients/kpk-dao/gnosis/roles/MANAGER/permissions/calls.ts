import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { GNO } from "@/addresses/gno"
import { allowErc20Transfer } from "@/helpers"
import { kfPaymentsGC } from "../../../addresses"
import { c } from "zodiac-roles-sdk"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Bridge
   *********************************************/
  // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer 200 GNO per month to kfPaymentsGC
  allowErc20Transfer([GNO], [kfPaymentsGC], "GNO_KF-PAYMENTS-GC"),
] satisfies PermissionList
