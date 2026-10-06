import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "@/addresses/eth"
import { settlementGuardScope } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

/** Assets this role settles in (the `asset` pin). Also read by scripts/settlementGuard.ts. */
export const settlementAssets = [WETH] as const

export default (parameters: Parameters) => {
  // OIV settlement guard: price band + call budget, values from the instance parameters
  const guard = settlementGuardScope(
    parameters.settlementGuard,
    "eth-alpha-fund REQUESTS"
  )
  return [
    // OIV Shares - Approve/reject subscription and redemption requests settled in WETH
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
