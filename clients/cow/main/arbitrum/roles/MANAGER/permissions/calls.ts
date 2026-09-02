import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { COW, WETH, uniswapV2 } from "@/addresses/arb1"
import { COW as COW_eth } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.arbitrumOne.weth.withdraw(),
    allow.arbitrumOne.weth.deposit({
      send: true,
    }),

    // Uniswap v2 - Add/remove liquidity for the WETH/COW pool
    allowErc20Approve([WETH, COW], [contracts.arbitrumOne.uniswapV2.router2]),
    allow.arbitrumOne.uniswapV2.router2.addLiquidity(
      c.or(WETH, COW),
      c.or(WETH, COW),
      undefined,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allowErc20Approve(
      [uniswapV2.wethCow],
      [contracts.arbitrumOne.uniswapV2.router2]
    ),
    allow.arbitrumOne.uniswapV2.router2.removeLiquidity(
      c.or(WETH, COW),
      c.or(WETH, COW),
      undefined,
      undefined,
      undefined,
      c.avatar
    ),

    /*********************************************
     * Bridges (Arbitrum -> Mainnet)
     *********************************************/
    // ETH - Arbitrum Bridge
    allow.arbitrumOne.arbitrumBridge.arbSys.withdrawEth(
      c.avatar, // Destination address
      {
        send: true,
      }
    ),

    // COW - Arbitrum Bridge
    // Token arg is the L1 (mainnet) token address; no approval needed (handled by the gateway)
    allow.arbitrumOne.arbitrumBridge.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](COW_eth, c.avatar, undefined, "0x"),
  ] satisfies PermissionList
