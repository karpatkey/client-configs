import { PermissionList } from "../../../../../../types"
import { contracts } from "../../../../../../eth-sdk/config"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/arb1"
import {
  COMP,
  DAI,
  USDC,
  USDCe,
  balancer,
} from "../../../../../../eth-sdk/addresses_arb"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/

  allow.arbitrumOne.compoundV3.cUsdcV3.withdraw(USDC),
] satisfies PermissionList
