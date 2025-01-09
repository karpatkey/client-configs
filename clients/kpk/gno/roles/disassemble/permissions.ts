import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
] satisfies PermissionList
