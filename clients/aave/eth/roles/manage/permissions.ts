import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { GHO, stkGHO } from "@/addresses/eth"
import { PermissionList } from "../../../../../types"
import { Parameters } from "../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * DeFi-Kit permissions
     *********************************************/
    // CowSwap - Swap GHO <-> stkGHO
    allowAction.cowswap.swap({
      sell: [GHO, stkGHO],
      buy: [GHO, stkGHO],
    }),

    // Aave Safety Module - Stake of GHO
    allowAction.aave_v3.stake({ targets: ["GHO"] }),

    /*********************************************
     * Typed-presets permissions
     *********************************************/
    allow.mainnet.aaveV2.gho.transfer(parameters.aaveCollector),
    allow.mainnet.aaveV2.aave.transfer(parameters.aaveCollector),
  ] satisfies PermissionList
