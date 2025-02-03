import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "@/addresses/eth"
import { mainTreasury } from "../../../../addresses"
import { allowEthTransfer } from "@/helpers"
import { PermissionList } from "@/types"
import { allowErc20Transfer } from "@/helpers"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
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
