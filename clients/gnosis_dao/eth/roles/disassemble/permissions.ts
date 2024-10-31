import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  ankrETH,
  DAI,
  GHO,
  ETHx,
  rETH,
  osETH,
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
  // Aave v2 - Staking of GHO in Safety Module
  allow.mainnet.aave_v2.stkGHO.redeem(c.avatar),
  allow.mainnet.aave_v2.stkGHO.cooldown(),

  // Aave v3 - Withdraw wstETH
  allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),

  // Aave v3 - Repay GHO
  ...allowErc20Approve([GHO], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(GHO, undefined, undefined, c.avatar),

  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

  // Aave v3 - Repay WBTC
  ...allowErc20Approve([WBTC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.repay(WBTC, undefined, undefined, c.avatar),

  // Ankr
  allow.mainnet.ankr.flashUnstake.swapEth(undefined, c.avatar),
  allow.mainnet.ankr.ETH2_Staking.unstakeAETH(),

  // Angle - wstETH-EUR-Vault
  allow.mainnet.angle.wstETH_EUR_Vault[
    "angle(uint8[],bytes[],address,address)"
  ](
    c.every(
      c.or(
        1, // closeVault
        3, // removeCollateral
        4 // repayDebt
      )
    ),
    c.every(
      c.or(
        c.abiEncodedMatches(
          [19],
          ["uint256"] // (vaultID)
        ), // closeVault
        c.abiEncodedMatches(
          [19],
          ["uint256", "uint256"] // 2,3:(vaultID, collateralAmount) or 4,5:(vaultID, stablecoinAmount)
        ) // addCollateral, removeCollateral, repayDebt, borrow
      )
    ),
    c.avatar,
    c.avatar
  ),

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

  // Aura - Lock
  allow.mainnet.aura.vlAURA.processExpiredLocks(),

  // Aura - Stake
  allow.mainnet.aura.auraBAL_staking_rewarder.withdraw(),
  allow.mainnet.aura.stkauraBAL.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.aura.stkauraBAL.redeem(undefined, c.avatar, c.avatar),

  // Autonolas - OLAS Withdraw
  allow.mainnet.autonolas.veolas.withdraw(),

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

  // Balancer - Lock
  allow.mainnet.balancer.veBAL.withdraw(),

  // Convex - Lock
  allow.mainnet.convex.vlCVX.processExpiredLocks(),

  // Enzyme - Diva stETH Vault
  // Withdraw stETH
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
  ),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Rocket Pool
  allow.mainnet.rocket_pool.rETH.burn(),
  allow.mainnet.rocket_pool.swap_router.swapFrom(),

  // Stader
  allow.mainnet.stader.user_withdraw_manager[
    "requestWithdraw(uint256,address)"
  ](undefined, c.avatar),
  allow.mainnet.stader.user_withdraw_manager.claim(),

  // Sommelier - TurboDIVETH
  allow.mainnet.sommelier.TurboDIVETH.redeem(undefined, c.avatar, c.avatar),

  // StakeWise v3 - Chorus One - MEV Max
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.burnOsToken(),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.enterExitQueue(
    undefined,
    c.avatar
  ),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.claimExitedAssets(),

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

  // Cowswap - [ETH, WETH] -> [DAI, USDT, USDC]
  cowswap__swap([E_ADDRESS, WETH], [DAI, USDT, USDC], Chain.eth),

  // CowSwap - DAI <> USDT
  cowswap__swap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - USDC <> USDT
  cowswap__swap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - wstETH -> stETH
  cowswap__swap([wstETH], [stETH], Chain.eth),

  // CowSwap - osETH <> WETH
  cowswap__swap([osETH], [WETH], Chain.eth),

  // CowSwap - rETH <> WETH
  cowswap__swap([rETH, WETH], [rETH, WETH], Chain.eth),

  // CowSwap - GHO <> USDC
  cowswap__swap([GHO, USDC], [GHO, USDC], Chain.eth),

  // Curve - Swaps in 3pool
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool["exchange"](),

  // Curve - Swap ETH/stETH (steCRV)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool["exchange"](),

  // Curve - Swaps ETH/stETH (stETH-ng-f)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stETH_ng_f_pool]),
  allow.mainnet.curve.stETH_ng_f_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Uniswap V3 - Swaps
  ...allowErc20Approve(
    [ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH],
    [contracts.mainnet.uniswap_v3.router_2]
  ),
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
