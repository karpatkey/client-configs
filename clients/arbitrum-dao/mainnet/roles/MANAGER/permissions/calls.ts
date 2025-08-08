import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDT } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../arbitrum/parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Arbitrum
    // USDT - Arbitrum Bridge
    ...allowErc20Approve(
      [USDT],
      [contracts.mainnet.arbitrumBridge.usdtOftAdapter]
    ),
    // https://docs.layerzero.network/v2/developers/evm/oft/oft-patterns-extensions#sending-token
    allow.mainnet.arbitrumBridge.usdtOftAdapter.send(
      {
        dstEid: "30110", // Arbitrum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar
    ),
  ] satisfies PermissionList
