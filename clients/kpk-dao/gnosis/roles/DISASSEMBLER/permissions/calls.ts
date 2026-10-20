import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

export default [
  // Unwrap of XDAI
  allow.gnosis.wxdai.withdraw(),
] satisfies PermissionList
