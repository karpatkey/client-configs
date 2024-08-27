import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  SAFE,
  USDC,
  WETH,
  wstETH,
  uniswap_v2,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),

  // Cowswap - Swapping of SAFE
  allowAction.cowswap.swap({
    sell: [SAFE],
    buy: ["ETH", DAI, USDC, WETH, wstETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Uniswap v3 - SAFE + WETH + wstETH (?) - Current NFT Ids: 711659 and 774338
  allowAction.uniswap_v3.deposit({ tokens: ["SAFE", "WETH", "wstETH"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Uniswap v2 - SAFE/WETH
  allowErc20Approve([SAFE], [contracts.mainnet.uniswap_v2.router_2]),
  allow.mainnet.uniswap_v2.router_2.addLiquidityETH(
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
    [uniswap_v2.LP_SAFE_ETH],
    [contracts.mainnet.uniswap_v2.router_2]
  ),
  allow.mainnet.uniswap_v2.router_2.removeLiquidityETH(
    SAFE,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
] satisfies PermissionList
