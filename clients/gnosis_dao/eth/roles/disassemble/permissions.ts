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
  eAddress,
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
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aave v3 - Withdraw wstETH
  allow.mainnet.aaveV3.lendingPoolV3.withdraw(wstETH, undefined, c.avatar),

  // Aave v3 - Repay GHO
  ...allowErc20Approve([GHO], [contracts.mainnet.aaveV3.lendingPoolV3]),
  allow.mainnet.aaveV3.lendingPoolV3.repay(GHO, undefined, undefined, c.avatar),

  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aaveV3.lendingPoolV3]),
  allow.mainnet.aaveV3.lendingPoolV3.repay(
    USDC,
    undefined,
    undefined,
    c.avatar
  ),

  // Aave v3 - Repay WBTC
  ...allowErc20Approve([WBTC], [contracts.mainnet.aaveV3.lendingPoolV3]),
  allow.mainnet.aaveV3.lendingPoolV3.repay(
    WBTC,
    undefined,
    undefined,
    c.avatar
  ),

  // Ankr
  allow.mainnet.ankr.flashUnstake.swapEth(undefined, c.avatar),
  allow.mainnet.ankr.eth2Staking.unstakeAETH(),

  // Angle - wstETH-EUR-Vault
  allow.mainnet.angle.wstEthEurVault["angle(uint8[],bytes[],address,address)"](
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
    aura.auraBauraBalStableRewarder,
    balancer.bAuraBalStablePid
  ),

  // Aura - COW/GNO
  aura__withdraw_balancer(aura.aura50Cow50GnoRewarder, balancer.b50Cow50GnoPid),

  // Aura - COW/WETH
  aura__withdraw_balancer(
    aura.aura50Cow50WethRewarder,
    balancer.b50Cow50WethPid
  ),

  // Aura - rETH/WETH
  aura__withdraw_balancer(
    aura.auraBrEthStableRewarder,
    balancer.bREthStablePid
  ),

  // Aura - Lock
  allow.mainnet.aura.vlAura.processExpiredLocks(),

  // Aura - Stake
  allow.mainnet.aura.auraBalStakingRewarder.withdraw(),
  allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar),

  // Autonolas - OLAS Withdraw
  allow.mainnet.autonolas.veOlas.withdraw(),

  // Balancer - auraBAL / B-80BAL-20WETH
  balancer__unstake_withdraw(Chain.eth, balancer.bAuraBalStableGauge),
  // Balancer - B-80BAL-20WETH
  balancer__withdraw(balancer.b80Bal20WethPid),

  // Balancer - COW/GNO
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50GnoGauge),

  // Balancer - COW/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50WethGauge),

  // Balancer - rETH/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.bREthStableGauge),

  // Balancer - Lock
  allow.mainnet.balancer.veBal.withdraw(),

  // Convex - Lock
  allow.mainnet.convex.vlCvx.processExpiredLocks(),

  // Enzyme - Diva stETH Vault
  // Withdraw stETH
  allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.divaStEthVault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
  ),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Rocket Pool
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),

  // Stader
  allow.mainnet.stader.userWithdrawManager["requestWithdraw(uint256,address)"](
    undefined,
    c.avatar
  ),
  allow.mainnet.stader.userWithdrawManager.claim(),

  // Sommelier - TurboDIVETH
  allow.mainnet.sommelier.turboDivEth.redeem(undefined, c.avatar, c.avatar),

  // StakeWise v3 - Chorus One - MEV Max
  allow.mainnet.stakeWiseV3.chrorusOneMevMax.burnOsToken(),
  allow.mainnet.stakeWiseV3.chrorusOneMevMax.enterExitQueue(
    undefined,
    c.avatar
  ),
  allow.mainnet.stakeWiseV3.chrorusOneMevMax.claimExitedAssets(),

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - Swap rETH <-> WETH
  balancer__swap(balancer.bREthStablePid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.bStEthStablePid, [WETH, wstETH], [wstETH, WETH]),

  // CowSwap - DAI -> [ETH, USDC, USDT]
  cowswap__swap([DAI], [eAddress, USDC, USDT], Chain.eth),

  // CowSwap - USDT -> [USDC, DAI, eAddress]
  cowswap__swap([USDT], [USDC, DAI, eAddress], Chain.eth),

  // Cowswap - USDC -> [DAI, USDT, eAddress]
  cowswap__swap([USDC], [DAI, USDT, eAddress], Chain.eth),

  // Cowswap - [ETH, WETH] -> [DAI, USDT, USDC]
  cowswap__swap([eAddress, WETH], [DAI, USDT, USDC], Chain.eth),

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
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool["exchange"](),

  // Curve - Swap ETH/stETH (steCRV)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool["exchange"](),

  // Curve - Swaps ETH/stETH (stETH-ng-f)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stEthNgfPool]),
  allow.mainnet.curve.stEthNgfPool["exchange(int128,int128,uint256,uint256)"](),

  // Uniswap V3 - Swaps
  ...allowErc20Approve(
    [ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle(
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
