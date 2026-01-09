import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { WETH } from "@/addresses/base"
import { WETH as WETH_eth } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

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

    // WETH - Across
    allowErc20Approve([WETH], [contracts.base.across.spokePool]),
    allow.base.across.spokePool.deposit(
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + WETH.slice(2).padStart(64, "0"),
      "0x" + WETH_eth.slice(2).padStart(64, "0"),
      undefined,
      undefined,
      1,
      // Relayer exclusivity is dynamically set by the Across API per quote
      // and must not be hardcoded.
      // https://docs.across.to/relayers/relayer-nomination
      undefined,
      undefined,
      undefined,
      undefined,
      "0x"
    ),
  ] satisfies PermissionList
