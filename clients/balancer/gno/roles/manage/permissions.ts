import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // StakeWise v3 - Genesis
  allow.gnosis.stakewise_v3.genesis.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.updateState(),
  allow.gnosis.stakewise_v3.genesis.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.genesis.burnOsToken(),
  allow.gnosis.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allow.gnosis.stakewise_v3.serenita.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.updateState(),
  allow.gnosis.stakewise_v3.serenita.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.serenita.burnOsToken(),
  allow.gnosis.stakewise_v3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allow.gnosis.stakewise_v3.nedo.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.updateState(),
  allow.gnosis.stakewise_v3.nedo.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.nedo.burnOsToken(),
  allow.gnosis.stakewise_v3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.claimExitedAssets(),
] satisfies PermissionList
