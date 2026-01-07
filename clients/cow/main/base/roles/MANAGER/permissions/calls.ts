import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.base.weth.withdraw(),
    allow.base.weth.deposit({
      send: true,
    }),

    /*********************************************
     * Bridge
     *********************************************/
    // Base -> Mainnet
    // ETH - Base Bridge - TODO!!!!!: verify _extraData: 1) bridgg data 0x6272696467670a or 2) superbridge data 0x73757065726272696467650a
    allow.base.baseBridge.bridgeETHTo(c.avatar, undefined, undefined, {
      send: true,
    }),

    // ETH - Stargate
    allow.base.stargate.poolNative.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),
  ] satisfies PermissionList
