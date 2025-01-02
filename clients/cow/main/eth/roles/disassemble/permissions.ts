import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { aura, balancer } from "../../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../../eth-sdk/config"
import {
  aura__withdraw_balancer,
  balancer__unstake_withdraw,
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../../helpers/exit_strategies"
import { PermissionList, Chain } from "../../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Aura - wstETH/WETH
  aura__withdraw_balancer(
    aura.auraBstEthStableRewarder,
    balancer.bStEthStablePid
  ),

  // Balancer - COW/GNO
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50GnoGauge),

  // Balancer - COW/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50WethGauge),

  // Balancer - wstETH/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.bStEthStableGauge),

  // Balancer - BCoW AMM COW/wstETH (Staking not available)
  allow.mainnet.balancer.bCow50Cow50Wsteth.exitPool(),

  // Balancer - BCoW AMM USDC/WETH
  allow.mainnet.balancer.bCow50Weth50Usdc.exitPool(),
  allow.mainnet.balancer.bCow50Weth50UsdcGauge["withdraw(uint256)"](),
  allow.mainnet.balancer.vault.setRelayerApproval(
    c.avatar,
    contracts.mainnet.balancer.relayer
  ),
  // gaugeWithdraw() added manually to the Relayer v6 ABI
  // from the RelayerLibrary: 0xeA66501dF1A00261E3bB79D1E90444fc6A186B62
  allow.mainnet.balancer.relayer.gaugeWithdraw(
    contracts.mainnet.balancer.bCow50Weth50UsdcGauge,
    c.avatar,
    c.avatar
  ),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Rocket Pool
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),
] satisfies PermissionList
