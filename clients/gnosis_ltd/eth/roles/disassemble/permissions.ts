import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "../../../../../eth-sdk/config"
import {
  AZUR,
  DAI,
  GRT,
  sDAI,
  USDC,
  USDT,
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

const GRAPH_DELEGATEE = "0x5A8904be09625965d9AEc4BFfD30D853438a053e"
const GNOSIS_LTD_ARB = "0x5B6e1AcD8494092C166b390C17f09694B9dDb42C"

export default [

] satisfies PermissionList
