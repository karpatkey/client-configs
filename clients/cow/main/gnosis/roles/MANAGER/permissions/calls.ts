import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { contracts } from "@/contracts"
import { WETH } from "@/addresses/gno"
import { allowErc20Approve } from "@/helpers"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // GNO - Gnosis Bridge
    allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // WETH - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: WETH,
    },

    // WETH -> ETH - Stargate
    allowErc20Approve([WETH], [contracts.gnosis.stargate.poolNative]),
    allow.gnosis.stargate.poolNative.send(
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

    // XDAI -> DAI - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
  ] satisfies PermissionList
