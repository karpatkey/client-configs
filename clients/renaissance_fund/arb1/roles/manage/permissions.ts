import { c } from "zodiac-roles-sdk"
import { allow as allowAction } from "defi-kit/arb1"
import { allow } from "zodiac-roles-sdk/kit"
import { GMX, USDC } from "../../../../../eth-sdk/addresses/arb1"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Swap GMX <-> USDC
  allowAction.cowswap.swap({
    sell: [GMX, USDC],
    buy: [GMX, USDC],
  }),

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
