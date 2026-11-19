import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { WETH as WETH_eth, wstETH as wstETH_eth } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

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

    // WETH - Arbitrum Bridge
    // No need to approve WETH for the bridge, as it is handled by the bridge
    allow.arbitrumOne.arbitrumBridge.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](WETH_eth, c.avatar, undefined, "0x"),

    // wstETH - Arbitrum Bridge
    // No need to approve wstETH for the bridge, as it is handled by the bridge
    allow.arbitrumOne.arbitrumBridge.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](wstETH_eth, c.avatar, undefined, "0x"),
  ] satisfies PermissionList
