import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
] satisfies PermissionList
