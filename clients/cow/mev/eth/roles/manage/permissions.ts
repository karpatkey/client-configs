import { avatar } from "../../../eth"
import { avatar as main } from "../../../../main/eth"
import { transferEth } from "../../../../../../helpers/transfers"
import { PermissionList } from "../../../../../../types"

export default [
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer ETH to Main Treasury
  transferEth(avatar, main),
] satisfies PermissionList
