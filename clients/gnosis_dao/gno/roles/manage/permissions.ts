import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  WXDAI,
  sDAI,
  USDC,
  USDCe,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"
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
] satisfies PermissionList
