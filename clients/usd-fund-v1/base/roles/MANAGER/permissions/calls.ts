import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // Base -> Mainnet
  // USDC - HOP
  allowErc20Approve([USDC], [contracts.base.hop.l2HopCctp]),
  allow.base.hop.l2HopCctp.send(
    1, // Mainnet
    c.avatar
  ),
] satisfies PermissionList
