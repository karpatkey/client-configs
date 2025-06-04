import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

export default [
  allow.gnosis.oiv.shares.processDepositRequests(),
  allow.gnosis.oiv.shares.processRedeemRequests(),
] satisfies PermissionList
