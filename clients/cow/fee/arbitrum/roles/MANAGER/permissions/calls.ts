import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { WETH } from "@/addresses/arb1"
import { mainTreasury } from "../../../../../addresses"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.arbitrumOne.weth.withdraw(),
  allow.arbitrumOne.weth.deposit({
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
