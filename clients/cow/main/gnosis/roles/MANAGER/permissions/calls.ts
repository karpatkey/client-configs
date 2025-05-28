import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { contracts } from "@/contracts"
import { parameters } from "../../../instances/main"
import { WETH } from "@/addresses/gno"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
  /*********************************************
   * Bridge
   *********************************************/
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
    send: true,
  }),
  // GNO (Gnosis) -> GNO (Mainnet)
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    parameters.avatar
  ),
  // WETH (Gnosis) -> WETH (Mainnet) - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
    targetAddress: WETH,
  },
  // ETH - Stargate
  allow.gnosis.stargate.poolNative.send(
    {
      to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      extraOptions: "0x",
      composeMsg: "0x",
      oftCmd: "0x01",
    },
    undefined,
    c.avatar,
    {
      send: true,
    }
  ),

] satisfies PermissionList
