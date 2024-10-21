import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  ankrETH,
  DAI,
  GHO,
  ETHx,
  rETH,
  USDC,
  USDT,
  WBTC,
  WETH,
  stETH,
  wstETH,
  aura,
  balancer,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import {
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies/lido"
import { aura__withdraw_balancer } from "../../../../../helpers/exit_strategies/aura"
import {
  balancer__withdraw,
  balancer__unstake_withdraw,
  balancer__swap,
} from "../../../../../helpers/exit_strategies/balancer"
import { cowswap__swap } from "../../../../../helpers/exit_strategies/cowswap"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { contracts } from "../../../../../eth-sdk/config"
import { Chain } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/

                                                             
  // Aave v3 - Withdraw wstETH
  allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),

  // Aave v3 - Repay GHO
  allow.mainnet.aave_v3.pool_v3.repay(GHO, undefined, undefined, c.avatar),

  // Aave v3 - Repay USDC
  allow.mainnet.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

  // Aave v3 - Repay WBTC
  allow.mainnet.aave_v3.pool_v3.repay(WBTC, undefined, undefined, c.avatar),


                                                              
  // Aura - auraBAL
  aura__withdraw_balancer(
    aura.auraB_auraBAL_stable_rewarder,
    balancer.B_auraBAL_stable_pId
  ),

  // Aura - COW/GNO
  aura__withdraw_balancer(
    aura.aura50COW_50GNO_rewarder,
    balancer.B_50COW_50GNO_pId
  ),

  // Aura - COW/WETH
  aura__withdraw_balancer(
    aura.aura50COW_50WETH_rewarder,
    balancer.B_50COW_50WETH_pId
  ),

  // Aura - rETH/WETH
  aura__withdraw_balancer(
    aura.auraB_rETH_stable_rewarder,
    balancer.B_rETH_stable_pid
  ),


                                                              
  // Balancer - auraBAL / B-80BAL-20WETH
  balancer__unstake_withdraw(Chain.eth, balancer.B_auraBAL_STABLE_gauge),
  // Balancer - B-80BAL-20WETH
  balancer__withdraw(balancer.B_80BAL_20WETH_pId),

  // Balancer - COW/GNO
  balancer__unstake_withdraw(Chain.eth, balancer.B_50COW_50GNO_gauge),

  // Balancer - COW/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.B_50COW_50WETH_gauge),

  // Balancer - rETH/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.B_rETH_stable_gauge),

  
  // Lido   
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),


  /*********************************************
   * SWAPS
   *********************************************/

                                                                          
  // Balancer - Swap rETH <-> WETH
  balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [wstETH, WETH]),


                                                                          
  // CowSwap - DAI -> [ETH, USDC, USDT]
  cowswap__swap([DAI], [E_ADDRESS, USDC, USDT], Chain.eth),

  // CowSwap - USDT -> [USDC, DAI, E_ADDRESS]
  cowswap__swap([USDT], [USDC, DAI, E_ADDRESS], Chain.eth),

  // Cowswap - USDC -> [DAI, USDT, E_ADDRESS]
  cowswap__swap([USDC], [DAI, USDT, E_ADDRESS], Chain.eth), 

  // Cowswap - WETH -> [DAI, USDT, USDC]
  cowswap__swap([WETH], [DAI, USDT, USDC], Chain.eth),


                                                                          
  // Curve - Swaps in 3pool
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool["exchange"](),

  // Curve - Swap ETH/stETH (steCRV)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool["exchange"](),

  // Curve - Swaps ETH/stETH (stETH-ng-f)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stETH_ng_f_pool]),
  allow.mainnet.curve.stETH_ng_f_pool["exchange(int128,int128,uint256,uint256)"](),


                                                                         
  // Uniswap V3 - Swaps
  ...allowErc20Approve([ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH], [contracts.mainnet.uniswap_v3.router_2]),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle(
    {
      tokenIn: c.or(ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH), 
      tokenOut: c.or(DAI, USDC, USDT, WETH, wstETH), 
      recipient: c.avatar,
    },
    {
      send: true,

    }
  ),

] satisfies PermissionList
