import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../../types"
import { USDC } from "../../../../../../eth-sdk/addresses_opt"

export default [
  // Aave v3 - Withdraw USDC
  allow.optimism.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),
] satisfies PermissionList
