import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { GNO } from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // StakeWise v3 - Genesis
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.genesis]),
  allow.gnosis.stakewise_v3.genesis.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.updateState(),
  allow.gnosis.stakewise_v3.genesis.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.genesis.burnOsToken(),
  allow.gnosis.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.serenita]),
  allow.gnosis.stakewise_v3.serenita.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.updateState(),
  allow.gnosis.stakewise_v3.serenita.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.serenita.burnOsToken(),
  allow.gnosis.stakewise_v3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.nedo]),
  allow.gnosis.stakewise_v3.nedo.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.updateState(),
  allow.gnosis.stakewise_v3.nedo.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.nedo.burnOsToken(),
  allow.gnosis.stakewise_v3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.claimExitedAssets(),

  /*********************************************
   * Bridge
   *********************************************/
  // GNO (Gnosis) -> GNO (Mainnet)
  /*
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    avatar
  ),
  */
] satisfies PermissionList
