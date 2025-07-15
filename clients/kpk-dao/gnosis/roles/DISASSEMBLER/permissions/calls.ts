import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "@/types"

export default [
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),

  // Spark - DSR_sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),

  // StakeWise v3 - Genesis
  allow.gnosis.stakeWiseV3.genesis.burnOsToken(),
  allow.gnosis.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.claimExitedAssets(),
  // StakeWise v3 - NEDO
  allow.gnosis.stakeWiseV3.nedo.burnOsToken(),
  allow.gnosis.stakeWiseV3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.claimExitedAssets(),
  // StakeWise v3 - Serenita
  allow.gnosis.stakeWiseV3.serenita.burnOsToken(),
  allow.gnosis.stakeWiseV3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.claimExitedAssets(),
] satisfies PermissionList
