import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

export default [
  allow.mainnet.oiv.shares.processDepositRequests(),
  allow.mainnet.oiv.shares.processRedeemRequests(),
] satisfies PermissionList