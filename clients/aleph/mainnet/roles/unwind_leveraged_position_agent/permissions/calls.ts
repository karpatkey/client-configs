import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Leverage Contract - Unwind leveraged positions
    allow.mainnet.oiv.leverage.deleverageAavePosition(),
  ] satisfies PermissionList
