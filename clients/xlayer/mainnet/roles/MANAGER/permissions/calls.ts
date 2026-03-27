import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDT } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    allowErc20Approve([USDT], [contracts.mainnet.layerZero.usdt0_bridge]),
    allow.mainnet.layerZero.usdt0_bridge.send(
      {
        dstEid: "30274", // X Layer
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"),
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),
  ] satisfies PermissionList
