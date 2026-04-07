import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDT } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    {
      ...allow.mainnet.oiv.shares.processRequests(undefined, undefined, USDC),
      targetAddress: parameters.shares,
    },
    {
      ...allow.mainnet.oiv.shares.processRequests(undefined, undefined, USDT),
      targetAddress: parameters.shares,
    },
  ] satisfies PermissionList
