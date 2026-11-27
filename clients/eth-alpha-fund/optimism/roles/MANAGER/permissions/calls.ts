import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Optimism -> Mainnet
    // ETH - brid.gg or superbridge
    allow.optimism.optimismBridge.optimismBridge.bridgeETHTo(
      c.avatar,
      undefined,
      // 0x6272696467670a equals bridgg in hex and 0x7375706572627269646765 equals superbridge in hex
      c.or("0x", "0x6272696467670a", "0x7375706572627269646765"),
      {
        send: true,
      }
    ),
  ] satisfies PermissionList
