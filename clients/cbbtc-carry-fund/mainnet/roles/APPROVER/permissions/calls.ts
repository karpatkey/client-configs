import { allow } from "zodiac-roles-sdk/kit"
import { cbBTC } from "@/addresses/eth"
import { settlementGuardScope } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

/** Assets this role settles in (the `asset` pin). Also read by scripts/settlementGuard.ts. */
export const settlementAssets = [cbBTC] as const

export default (parameters: Parameters) => {
  // OIV settlement guard: price band + call budget, values from the instance parameters
  const guard = settlementGuardScope(
    parameters.settlementGuard,
    "cbbtc-carry-fund APPROVER"
  )
  return [
    // OIV Shares - Approve/reject subscription and redemption requests settled in cbBTC
    guard.withCallBudget({
      ...allow.mainnet.oiv.shares.processRequests(
        undefined,
        undefined,
        guard.asset(settlementAssets),
        guard.sharesPriceInAsset
      ),
      targetAddress: parameters.shares,
    }),
  ] satisfies PermissionList
}
