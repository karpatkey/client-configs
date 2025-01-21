import { allow as allowAction } from "defi-kit/oeth"
import { PermissionList } from "../../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
] satisfies PermissionList
