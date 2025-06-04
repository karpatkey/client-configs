import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

export default [
  allow.arbitrumOne.oiv.shares.processDepositRequests(),
  allow.arbitrumOne.oiv.shares.processRedeemRequests(),
] satisfies PermissionList
