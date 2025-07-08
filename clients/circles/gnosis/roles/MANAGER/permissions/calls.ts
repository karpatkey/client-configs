import { sDAI } from "@/addresses/gno"
import { operationsCircles } from "../../../addresses"
import { PermissionList } from "@/types"
import { allowErc20Transfer } from "@/helpers"

export default [
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 50k sDAI every 48 hours to operationsCircles
  allowErc20Transfer([sDAI], [operationsCircles], "SDAI_OP-CIRCLES"),
] satisfies PermissionList
