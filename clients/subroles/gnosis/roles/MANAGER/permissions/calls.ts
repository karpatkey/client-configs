import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { PermissionList } from "@/types"

export default [
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.depositETH(
    contracts.gnosis.aaveV3.poolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.gnosis.spark.savingsXdaiAdapter.depositXDAI(
    c.avatar,
    { send: true }
  ),
] satisfies PermissionList
