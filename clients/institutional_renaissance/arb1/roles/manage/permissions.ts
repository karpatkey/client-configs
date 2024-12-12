import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "../../../../../eth-sdk/addresses_arb"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.arbitrumOne.navCalculator.bridgeStart(),

  // Arbitrum -> Mainnet
  // USDC (Arbitrum) -> USDC (Mainnet) - HOP
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.l2HopCctp]),
  allow.arbitrumOne.l2HopCctp.send(
    1, // Mainnet
    c.avatar
  ),
] satisfies PermissionList
