import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "@/types"

export default [
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),

  // Spark - DSR_sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
] satisfies PermissionList
