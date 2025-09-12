import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Transfer } from "@/helpers"
import { WXDAI } from "@/addresses/gno"
import { bridgeInterestReceiverGno } from "../../../../../addresses"

export default [
  // Wrapping of XDAI
  allow.gnosis.wxdai.deposit({ send: true }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 80k WXDAI to the Bridge Interest Receiver
  allowErc20Transfer(
    [WXDAI],
    [bridgeInterestReceiverGno],
    "ALLOWANCE-BridgeKeeper"
  ),
] satisfies PermissionList
