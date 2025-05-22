import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { kpkFoundationEth } from "../../../addresses"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // Gnosis -> Mainnet
  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.xdaiBridge2.relayTokens(kpkFoundationEth, {
    send: true,
  }),
] satisfies PermissionList
