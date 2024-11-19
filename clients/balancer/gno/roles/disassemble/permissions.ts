import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../types"

export default [
  // Spark - DSR/sDAI
  allow.gnosis.spark.SavingsXDaiAdapter.redeemXDAI(undefined, c.avatar),
  allow.gnosis.spark.SavingsXDaiAdapter.redeem(undefined, c.avatar),

  // StakeWise v3 - Genesis
  allow.gnosis.stakewise_v3.genesis.burnOsToken(),
  allow.gnosis.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allow.gnosis.stakewise_v3.serenita.burnOsToken(),
  allow.gnosis.stakewise_v3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allow.gnosis.stakewise_v3.nedo.burnOsToken(),
  allow.gnosis.stakewise_v3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.claimExitedAssets(),

  // StakeWise v3 - Axol.io
  allow.gnosis.stakewise_v3.axol.burnOsToken(),
  allow.gnosis.stakewise_v3.axol.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.axol.claimExitedAssets(),

  // StakeWise v3 - Stakecat
  allow.gnosis.stakewise_v3.stakecat.burnOsToken(),
  allow.gnosis.stakewise_v3.stakecat.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakecat.claimExitedAssets(),

  // StakeWise v3 - SEEDNode
  allow.gnosis.stakewise_v3.seednode.burnOsToken(),
  allow.gnosis.stakewise_v3.seednode.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.seednode.claimExitedAssets(),

  // StakeWise v3 - Stakesaurus
  allow.gnosis.stakewise_v3.stakesaurus.burnOsToken(),
  allow.gnosis.stakewise_v3.stakesaurus.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakesaurus.claimExitedAssets(),
] satisfies PermissionList
