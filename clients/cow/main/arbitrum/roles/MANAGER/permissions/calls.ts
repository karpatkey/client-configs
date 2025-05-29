import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.arbitrumOne.weth.withdraw(),
    allow.arbitrumOne.weth.deposit({
      send: true,
    }),
    
    /*********************************************
     * Bridge
     *********************************************/
    // Arbitrum -> Mainnet
    // ETH - Arbitrum Bridge
    allow.arbitrumOne.arbitrumBridge.arbSys.withdrawEth(
      c.avatar, // Destination address
      {
        send: true,
      }
    ),

    // ETH - Stargate
    allow.arbitrumOne.stargate.poolNative.send(
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
