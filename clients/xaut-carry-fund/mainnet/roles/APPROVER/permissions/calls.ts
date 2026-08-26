import { allow } from "zodiac-roles-sdk/kit"
import { XAUt } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // OIV Shares - Approve/reject subscription and redemption requests settled in XAUt
    {
      ...allow.mainnet.oiv.shares.processRequests(
        undefined,
        undefined,
        XAUt,
        undefined
      ),
      targetAddress: parameters.shares,
    },
  ] satisfies PermissionList
