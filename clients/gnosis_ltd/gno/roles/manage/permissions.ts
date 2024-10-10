import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { contracts } from "../../../../../eth-sdk/config"
import {
  USDC,
  USDT,
} from "../../../../../eth-sdk/addresses_gno"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/

] satisfies PermissionList
