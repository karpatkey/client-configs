import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  GHO,
  USDC,
  WBTC,
  stETH,
  wstETH,
  aura,
  balancerV2,
} from "@/addresses/eth"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import {
  balancerV2UnstakeWithdraw,
  balancerV2Withdraw,
} from "@/exit_strategies/balancerV2"
import {
  lidoUnstakeStEth,
  lidoUnwrapAndUnstakeWstEth,
} from "@/exit_strategies/lido"
import { allowErc20Approve } from "@/helpers"
import { contracts } from "@/contracts"
import { Chain, PermissionList } from "@/types"

export default [
  // Aave Safety Module - Unstake GHO
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aave v3 - Withdraw wstETH
  allow.mainnet.aaveV3.poolCoreV3.withdraw(wstETH, undefined, c.avatar),

  // Aave v3 - Repay GHO
  allowErc20Approve([GHO], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(GHO, undefined, undefined, c.avatar),

  // Aave v3 - Repay USDC
  allowErc20Approve([USDC], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(USDC, undefined, undefined, c.avatar),

  // Aave v3 - Repay WBTC
  allowErc20Approve([WBTC], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(WBTC, undefined, undefined, c.avatar),

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
  auraWithdrawBalancer(
    aura.auraBauraBalStableRewarder,
    balancerV2.bAuraBalStablePid
  ),

  // Aura - COW/GNO
  auraWithdrawBalancer(
    aura.aura50Cow50GnoRewarder,
    balancerV2.b50Cow50GnoPid,
    false
  ),

  // Aura - COW/WETH
  auraWithdrawBalancer(
    aura.aura50Cow50WethRewarder,
    balancerV2.b50Cow50WethPid,
    false
  ),

  // Aura - rETH/WETH
  auraWithdrawBalancer(aura.auraBrEthStableRewarder, balancerV2.bREthStablePid),

  // Aura - Lock
  allow.mainnet.aura.vlAura.processExpiredLocks(),

  // Aura - Stake
  allow.mainnet.aura.auraBalStakingRewarder.withdraw(),
  allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar),

  // Autonolas - OLAS Withdraw
  allow.mainnet.autonolas.veOlas.withdraw(),

  // Balancer v2 - auraBAL / B-80BAL-20WETH
  balancerV2UnstakeWithdraw(Chain.eth, balancerV2.bAuraBalStableGauge),
  // Balancer v2 - B-80BAL-20WETH
  balancerV2Withdraw(balancerV2.b80Bal20WethPid),

  // Balancer v2 - COW/GNO
  balancerV2UnstakeWithdraw(Chain.eth, balancerV2.b50Cow50GnoGauge, false),

  // Balancer v2 - COW/WETH
  balancerV2UnstakeWithdraw(Chain.eth, balancerV2.b50Cow50WethGauge, false),

  // Balancer v2 - rETH/WETH
  balancerV2UnstakeWithdraw(Chain.eth, balancerV2.bREthStableGauge),

  // Balancer - Lock
  allow.mainnet.balancerV2.veBal.withdraw(),

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
  lidoUnstakeStEth(),
  lidoUnwrapAndUnstakeWstEth(),

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
