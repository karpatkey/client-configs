import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { contracts } from "../../../../../eth-sdk/config"
import { PermissionList } from "../../../../../types"

export default [
  allow.mainnet.aura.auraB_stETH_stable_rewarder["withdrawAndUnwrap"](),
] satisfies PermissionList
