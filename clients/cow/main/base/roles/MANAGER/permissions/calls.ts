import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { COW, WETH, pancakeSwapV2 } from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.base.weth.withdraw(),
    allow.base.weth.deposit({
      send: true,
    }),

    // PancakeSwap v2 - Add/remove liquidity for the WETH/COW pool
    allowErc20Approve([WETH, COW], [contracts.base.pancakeSwapV2.router]),
    allow.base.pancakeSwapV2.router.addLiquidity(
      c.or(WETH, COW),
      c.or(WETH, COW),
      undefined,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allowErc20Approve(
      [pancakeSwapV2.wethCow],
      [contracts.base.pancakeSwapV2.router]
    ),
    allow.base.pancakeSwapV2.router.removeLiquidity(
      c.or(WETH, COW),
      c.or(WETH, COW),
      undefined,
      undefined,
      undefined,
      c.avatar
    ),

    /*********************************************
     * Bridges (Base -> Mainnet)
     *********************************************/
    // ETH - Stargate
    allow.base.stargate.poolNative.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        // 0x = default / no LayerZero options; 0x0003 = empty TYPE_3 options container
        extraOptions: c.or("0x", "0x0003"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"),
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),

    // COW - Superbridge (native Base bridge / L2StandardBridge withdrawTo)
    allow.base.baseBridge.l2StandardBridgeProxy.withdrawTo(
      COW,
      c.avatar,
      undefined,
      undefined,
      // extraData marker: "" | brid.gg | superbridge
      c.or("0x", "0x6272696467670a", "0x7375706572627269646765")
    ),
  ] satisfies PermissionList
