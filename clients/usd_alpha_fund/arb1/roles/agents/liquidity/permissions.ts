import { c } from "zodiac-roles-sdk"
import { PermissionList } from "../../../../../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "@/addresses/arb1"

export default [
  // Aave v3 - Withdraw USDC
  // Aave's UI does not call the withdraw(address,uint256,address)
  // function version but instead uses the withdraw(bytes) one.
  // I tested whether using this function yields the same result,
  // and it worked: https://www.tdly.co/shared/simulation/0906058f-2ee5-4a85-8639-21951ff3347a
  allow.arbitrumOne.aaveV3.poolV3["withdraw(address,uint256,address)"](
    USDC,
    undefined,
    c.avatar
  ),

  // Compound v3 - Withdraw USDC
  allow.arbitrumOne.compoundV3.cUsdcV3.withdraw(USDC),
] satisfies PermissionList
