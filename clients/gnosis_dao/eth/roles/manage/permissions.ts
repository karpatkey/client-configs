import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  CRV,
  COMP,
  CVX,
  DAI,
  GHO,
  NOTE,
  USDC,
  USDT,
  SAFE,
  stETH,
  WBTC,
  WETH,
  wstETH,
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses"
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
] satisfies PermissionList
