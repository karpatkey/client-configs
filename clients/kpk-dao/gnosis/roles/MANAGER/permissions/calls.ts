import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { GNO, WXDAI } from "@/addresses/gno"
import { allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { kpkEth, kfPaymentsGC } from "../../../addresses"
import { vcbGc } from "../../../../mainnet/addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Bridge
   *********************************************/
  // Bridge - Gnosis -> Mainnet
  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.xdaiBridge2.relayTokens(kpkEth, {
    send: true,
  }),
  // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer 200 GNO per month to kfPaymentsGC
  allowErc20Transfer([GNO], [kfPaymentsGC], "GNO_KF-PAYMENTS-GC"),

  // Transfer 600K xDAI per month to vcbGC
  allowEthTransfer(vcbGc, "XDAI_VCBGC-GC"),

  // Transfer 600K WXDAI per month to vcbGC
  allowErc20Transfer([WXDAI], [vcbGc], "XDAI_VCBGC-GC"),
] satisfies PermissionList
