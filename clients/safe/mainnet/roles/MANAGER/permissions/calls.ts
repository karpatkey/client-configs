import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { DAI, SAFE, uniswapV2, USDC, USDS, USDT, WETH } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Aave v3 - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Withdraw USDS
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDS, undefined, c.avatar),
  // Aave v3 - Withdraw DAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDT
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDT, undefined, c.avatar),
  // Aave v3 - Withdraw WETH
  allow.mainnet.aaveV3.poolCoreV3.withdraw(WETH, undefined, c.avatar),

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
