import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { parameters } from "../../../instances/main"
import { allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { mainTreasury } from "../../../../../addresses"
import { WETH } from "@/addresses/base"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.base.weth.withdraw(),
  allow.base.weth.deposit({
    send: true,
  }),
  /*********************************************
   * Bridge
   *********************************************/
  // Base -> Mainnet
  // ETH - Base Native Bridge
  //TODO

  // ETH - Stargate
  allow.base.stargate.poolNative.send(
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
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer ETH to Main Treasury
  allowEthTransfer(mainTreasury),
  // Transfer WETH to Main Treasury
  allowErc20Transfer([WETH], [mainTreasury]),
] satisfies PermissionList
