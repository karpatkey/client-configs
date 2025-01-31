import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../../types"
import { USDC } from "@/addresses/oeth"

export default [
  // Aave v3 - Withdraw USDC
  // Aave's UI does not call the withdraw(address,uint256,address)
  // function version but instead uses the withdraw(bytes) one.
  // I tested whether using this function yields the same result,
  // and it worked: https://www.tdly.co/shared/simulation/329f74a8-b1ff-4fc7-94d4-7167ddce68cc
  allow.optimism.aaveV3.poolV3["withdraw(address,uint256,address)"](
    USDC,
    undefined,
    c.avatar
  ),
] satisfies PermissionList
