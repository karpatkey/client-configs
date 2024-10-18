import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { wstETH, GHO, USDC, WBTC, aura, balancer } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import { lido__unstake_stETH, lido__unwrap_and_unstake_wstETH } from '../../../../../helpers/exit_strategies/lido';
import { aura__withdraw_balancer } from '../../../../../helpers/exit_strategies/aura';
import { balancer__withdraw, balancer__unstake_withdraw } from '../../../../../helpers/exit_strategies/balancer';
import { Chain } from "../../../../../types";

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/

  // Aave v2 - Unstake GHO from Safety Module
  allow.mainnet.aave_v2.stkGHO.cooldown(),
  allow.mainnet.aave_v2.stkGHO.redeem(c.avatar),

  // Aave v3 - Withdraw wstETH
  allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),

  // Aave v3 - Repay GHO
  allow.mainnet.aave_v3.pool_v3.repay(GHO, undefined, undefined, c.avatar),

  // Aave v3 - Repay USDC
 allow.mainnet.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

 // Aave v3 - Repay WBTC
 allow.mainnet.aave_v3.pool_v3.repay(WBTC, undefined, undefined, c.avatar),

 // Aura - auraBAL
 // we use aura & balancer addresses from addresses.ts with the helper functions And the ones in config.ts for the others
 aura__withdraw_balancer(aura.auraB_auraBAL_stable_rewarder, balancer.B_auraBAL_stable_pId),

 // Aura - COW/GNO
 aura__withdraw_balancer(aura.aura50COW_50GNO_rewarder, balancer.B_50COW_50GNO_pId),

 // Aura - COW/WETH
 aura__withdraw_balancer(aura.aura50COW_50WETH_rewarder , balancer.B_50COW_50WETH_pId),  

 // Aura - rETH/WETH
 aura__withdraw_balancer(aura.auraB_rETH_stable_rewarder , balancer.B_rETH_stable_pid),

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

] satisfies PermissionList
