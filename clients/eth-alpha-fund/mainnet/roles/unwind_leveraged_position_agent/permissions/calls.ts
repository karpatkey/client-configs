import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // AaveV3MorphoFlashLeverage Contract - Unwind leveraged positions
    // maxSwapPriceImpact (WAD) capped at 2% for the bot key. The call also goes through the
    // Main's MANAGER scope (5% cap and the Kyber route pins), so the stricter cap applies.
    allow.mainnet.oiv.leverage.deleverageAavePosition(
      undefined,
      undefined,
      undefined,
      c.lte(20000000000000000n),
      undefined,
      undefined,
      {
        delegatecall: true,
      }
    ),
  ] satisfies PermissionList
