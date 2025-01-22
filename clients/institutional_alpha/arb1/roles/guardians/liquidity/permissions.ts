import { c } from "zodiac-roles-sdk"
import { PermissionList } from "../../../../../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "../../../../../../eth-sdk/addresses_arb"

export default [
  // Aave v3 - Withdraw USDC
  allow.arbitrumOne.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.arbitrumOne.compoundV3.cUsdcV3.withdraw(USDC),
] satisfies PermissionList
