import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "../../../../../../eth-sdk/addresses"
import { avatar as main } from "../../../../main/eth"
import { PermissionList } from "../../../../../../types"
import { allowErc20Transfer } from "../../../../../../helpers/erc20"
import { allowEthTransfer } from "../../../../../../helpers/allowEthTransfer"

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
  allowEthTransfer(main),
  // Transfer WETH to Main Treasury
  allowErc20Transfer([WETH], [main]),
] satisfies PermissionList
