import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { kpkFoundationEth } from "../../../addresses"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
  
  // Gnosis -> Mainnet
  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.xdaiBridge2.relayTokens(kpkFoundationEth, {
    send: true,
  }),
] satisfies PermissionList
