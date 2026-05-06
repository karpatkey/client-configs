import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // AaveV3MorphoFlashLeverage Contract - Unwind leveraged positions
    allow.mainnet.oiv.leverage.deleverageAavePosition(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        delegatecall: true
      }
    ),
  ] satisfies PermissionList
