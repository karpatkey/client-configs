import { allow } from "zodiac-roles-sdk/kit"
import { WBTC } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // OIV Shares - Approve/reject subscription and redemption requests settled in WBTC
    {
      ...allow.mainnet.oiv.shares.processRequests(
        undefined,
        undefined,
        WBTC,
        undefined
      ),
      targetAddress: parameters.shares,
    },
  ] satisfies PermissionList
