import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),

  // Spark - DSR/sDAI
  allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),
] satisfies PermissionList
