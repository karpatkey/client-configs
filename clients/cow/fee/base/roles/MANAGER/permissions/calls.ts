import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { mainTreasury } from "../../../../../addresses"
import { WETH } from "@/addresses/base"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.base.weth.withdraw(),
  allow.base.weth.deposit({
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer ETH to Main Treasury
  allowEthTransfer(mainTreasury),

  // Transfer WETH to Main Treasury
  allowErc20Transfer([WETH], [mainTreasury]),
] satisfies PermissionList
