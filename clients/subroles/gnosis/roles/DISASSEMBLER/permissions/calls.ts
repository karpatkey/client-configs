import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  ...allowErc20Approve(
    [contracts.gnosis.aaveV3.aGnoWXDAI],
    [contracts.gnosis.aaveV3.wrappedTokenGatewayV3]
  ),
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.depositETH(
    undefined,
    undefined,
    undefined,
    { send: true }
  ),

  ...allowErc20Approve(
    [contracts.gnosis.spark.sDai],
    [contracts.gnosis.spark.savingsXdaiAdapter]
  ),
  allow.gnosis.spark.savingsXdaiAdapter.depositXDAI(undefined, { send: true }),
] satisfies PermissionList
