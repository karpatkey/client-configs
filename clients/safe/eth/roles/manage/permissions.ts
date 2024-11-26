import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  DAI,
  osETH,
  rETH,
  SAFE,
  stETH,
  USDC,
  WETH,
  wstETH,
  uniswapV2,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - osETH/WETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),

  // CowSwap - Swapping of SAFE
  allowAction.cowswap.swap({
    sell: [SAFE],
    buy: ["ETH", DAI, stETH, USDC, WETH, wstETH],
  }),
  // CowSwap - Swapping of ETH
  allowAction.cowswap.swap({
    sell: ["ETH"],
    buy: [DAI, osETH, stETH, rETH, USDC, WETH, wstETH],
  }),
  // CowSwap - Swapping of AURA and BAL
  allowAction.cowswap.swap({
    sell: [AURA, BAL],
    buy: ["ETH", USDC, WETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Uniswap v3 - SAFE + WETH - Current NFT Ids: 711659 and 774338
  allowAction.uniswap_v3.deposit({ tokens: ["SAFE", "WETH"] }),

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
    [uniswapV2.LP_SAFE_ETH],
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
