import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { SAFE, uniswapV2 } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Uniswap v2 - SAFE/WETH
  allowErc20Approve([SAFE], [contracts.mainnet.uniswapV2.router2]),
  allow.mainnet.uniswapV2.router2.addLiquidityETH(
    SAFE,
    undefined,
    undefined,
    undefined,
    c.avatar,
    undefined,
    {
      send: true,
    }
  ),
  allowErc20Approve(
    [uniswapV2.lpSafeEth],
    [contracts.mainnet.uniswapV2.router2]
  ),
  allow.mainnet.uniswapV2.router2.removeLiquidityETH(
    SAFE,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
] satisfies PermissionList
