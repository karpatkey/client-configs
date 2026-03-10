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
        // 0x = default / no LayerZero options
        // 0x0003 = empty LayerZero TYPE_3 options container (OptionsBuilder.newOptions())
        // https://github.com/LayerZero-Labs/LayerZero-v2/blob/9c741e7f9790639537b1710a203bcdfd73b0b9ac/packages/layerzero-v2/evm/oapp/contracts/oapp/libs/OptionsBuilder.sol#L22
        extraOptions: c.or("0x", "0x0003"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"), // https://docs.stargate.finance/developers/protocol-docs/transfer#sendparamoftcmd
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),
  ] satisfies PermissionList
