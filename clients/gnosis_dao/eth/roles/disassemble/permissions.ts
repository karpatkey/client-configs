import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  GHO,
  USDC,
  WBTC,
  stETH,
  wstETH,
  aura,
  balancer,
} from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import {
  aura__withdraw_balancer,
  balancer__withdraw,
  balancer__unstake_withdraw,
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { contracts } from "../../../../../eth-sdk/config"
import { Chain } from "../../../../../types"

export default [
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
  aura__withdraw_balancer(
    aura.aura50Cow50GnoRewarder,
    balancer.b50Cow50GnoPid,
    false
  ),

  // Aura - COW/WETH
  aura__withdraw_balancer(
    aura.aura50Cow50WethRewarder,
    balancer.b50Cow50WethPid,
    false
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
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50GnoGauge, false),

  // Balancer - COW/WETH
  balancer__unstake_withdraw(Chain.eth, balancer.b50Cow50WethGauge, false),

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
] satisfies PermissionList
