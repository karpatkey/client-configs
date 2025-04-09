
import { allow } from "zodiac-roles-sdk/kit"
import {
  GNO,
  SAFE,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Balancer v2 - BCoW 50GNO/50SAFE (Staking not available)
  ...allowErc20Approve(
    [GNO, SAFE],
    [contracts.gnosis.balancerV2.bCow50Gno50Safe]
  ),
  allow.gnosis.balancerV2.bCow50Gno50Safe.joinPool(),
  allow.gnosis.balancerV2.bCow50Gno50Safe.exitPool(),

  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
] satisfies PermissionList
