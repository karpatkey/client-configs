import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import {
  WETH,
} from "@/addresses/arb1"
import {
  WETH as WETH_eth,
  wstETH as wstETH_eth,
}from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
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
    allow.arbitrumOne.arbitrumBridge.gatewayRouter["outboundTransfer(address,address,uint256,bytes)"](
      WETH_eth,
      c.avatar,
      undefined,
      "0x",
    ),

    // WETH - Across
    allowErc20Approve([WETH], [contracts.mainnet.across.ethereumSpokePoolV2]),
    allow.mainnet.across.ethereumSpokePoolV2.deposit(
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + WETH.slice(2).padStart(64, "0"),
      "0x" + WETH_eth.slice(2).padStart(64, "0"),
      undefined,
      undefined,
      1,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      undefined,
      undefined,
      undefined,
      "0x",
    ),

    // wstETH - Arbitrum Bridge
    // No need to approve wstETH for the bridge, as it is handled by the bridge
    allow.arbitrumOne.arbitrumBridge.gatewayRouter["outboundTransfer(address,address,uint256,bytes)"](
      wstETH_eth,
      c.avatar,
      undefined,
      "0x",
    ),
  ] satisfies PermissionList
