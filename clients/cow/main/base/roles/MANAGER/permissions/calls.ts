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
    // ETH - brid.gg or superbridge
    allow.base.baseBridge.l2StandardBridgeProxy.bridgeETHTo(
      c.avatar,
      undefined,
      // 0x6272696467670a equals bridgg in hex and 0x7375706572627269646765 equals superbridge in hex
      c.or("0x", "0x6272696467670a", "0x7375706572627269646765"),
      {
        send: true,
      }
    ),

    // ETH - Stargate
    allow.base.stargate.poolNative.send(
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
