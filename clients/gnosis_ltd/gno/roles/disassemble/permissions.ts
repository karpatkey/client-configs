import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { contracts } from "../../../../../eth-sdk/config"
import { PermissionList } from "../../../../../types"
import { aura } from "../../../../../eth-sdk/addresses"

export default [
  {
    ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
    targetAddress: "0x7513105d6cf9d18756d95ded81d6d3f68db4b8da",
  },
] satisfies PermissionList
