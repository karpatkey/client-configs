import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    allow.mainnet.aaveV2.gho.transfer(parameters.aaveCollector),
    allow.mainnet.aaveV2.aave.transfer(parameters.aaveCollector),
  ] satisfies PermissionList
