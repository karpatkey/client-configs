import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { aura, balancer } from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import {
  aura__withdraw_balancer,
  balancer__unstake_withdraw,
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies"
import { PermissionList, Chain } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Aura - wstETH/WETH
  aura__withdraw_balancer(
    aura.auraB_stETH_stable_rewarder,
    balancer.B_stETH_stable_pid
  ),

  // Balancer - COW/GNO
  balancer__unstake_withdraw(Chain.eth, balancer.B_50COW_50GNO_gauge),
  // Balancer - COW/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.B_50COW_50WETH_gauge),
  // Balancer - wstETH/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.B_stETH_stable_gauge),

  // Balancer - BCoW AMM COW/wstETH (Staking not available)
  allow.mainnet.balancer.BCoW_50COW_50wstETH.exitPool(),
  // Balancer - BCoW AMM USDC/WETH
  allow.mainnet.balancer.BCoW_50WETH_50USDC.exitPool(),
  // gaugeWithdraw() added manually to the Relayer v6 ABI
  // from the RelayerLibrary: 0xeA66501dF1A00261E3bB79D1E90444fc6A186B62
  allow.mainnet.balancer.relayer.gaugeWithdraw(
    contracts.mainnet.balancer.BCoW_50WETH_50USDC_gauge,
    c.avatar,
    c.avatar
  ),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

   // Rocket Pool
   allowAction.rocket_pool.deposit(),
] satisfies PermissionList
