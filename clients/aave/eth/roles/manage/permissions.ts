import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { GHO, stkGHO } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { aaveCollector } from "../../../eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Swap GHO <-> stkGHO
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
  }),

  // Aave Safety Module - Stake of GHO
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  allow.mainnet.aaveV2.gho.transfer(aaveCollector),
  allow.mainnet.aaveV2.aave.transfer(aaveCollector),
] satisfies PermissionList
