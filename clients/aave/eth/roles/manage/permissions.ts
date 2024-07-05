import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  GHO,
  stkGHO
} from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"

const aave_collector = "0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // CowSwap - Swap GHO <-> stkGHO
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
  }),

  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  allow.mainnet.aave_v2.gho.transfer(
    aave_collector
  ),
  allow.mainnet.aave_v2.aave.transfer(
    aave_collector
  )

] satisfies PermissionList