import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    allow.xlayer.layerZero.usdt0_bridge.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"),
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    )
  ] satisfies PermissionList
