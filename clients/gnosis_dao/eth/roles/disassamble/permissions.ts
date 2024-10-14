import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { wstETH } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v2 - Unstake GHO from Safety Module
  allow.mainnet.aave_v2.stkGHO.cooldown(),
  allow.mainnet.aave_v2.stkGHO.redeem(c.avatar),

  // Aave v3 - Withdraw wstETH
  allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),
] satisfies PermissionList
