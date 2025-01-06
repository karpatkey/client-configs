import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "../../../../../../eth-sdk/addresses"
import { avatar as main } from "../../../../main/eth"
import { transferEth, transferErc20 } from "../../../../../../helpers/transfers"
import { PermissionList } from "../../../../../../types"

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
  transferEth(main),
  // Transfer WETH to Main Treasury
  transferErc20(WETH, main),
] satisfies PermissionList
