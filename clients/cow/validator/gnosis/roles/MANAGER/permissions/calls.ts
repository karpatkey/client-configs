import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { GNO, sDAI, WETH, WXDAI } from "@/addresses/gno"
import { mainTreasury } from "../../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer XDAI to Main Treasury
  allowEthTransfer(mainTreasury),

  // Transfer [GNO, sDAI, WETH, WXDAI] to Main Treasury
  allowErc20Transfer([GNO, sDAI, WETH, WXDAI], [mainTreasury]),
] satisfies PermissionList