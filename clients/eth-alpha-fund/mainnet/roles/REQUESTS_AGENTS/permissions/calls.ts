import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    {
      ...allow.mainnet.oiv.shares.processRequests(undefined, undefined, WETH),
      targetAddress: parameters.shares,
    },
  ] satisfies PermissionList
