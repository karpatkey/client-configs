import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Spark - DSR_sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
] satisfies PermissionList
