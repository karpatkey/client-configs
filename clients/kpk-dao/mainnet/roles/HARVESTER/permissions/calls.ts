import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  eETH,
  GHO,
  USDC,
  weETH,
  aura,
  balancerV2,
  convex,
  fluid,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import { convexWithdraw } from "@/exit_strategies/convex"

export default [
  // Aave Safety Module - Stake AAVE rewards
  allow.mainnet.aaveV2.stkAave.claimRewards(c.avatar),
  // Aave Safety Module - Stake GHO rewards
  allow.mainnet.aaveV2.stkGho.claimRewards(c.avatar),
  // Aave Incentives rewards
  allow.mainnet.aaveV3.incentivesV3.claimRewards(
    undefined,
    undefined,
    c.avatar
  ),

  // Aave - ACI (Aave Chan Initiative) - Aave Stream Collector
  allow.mainnet.aaveV3.aaveCollectorV2.withdrawFromStream(),

  // Aura - rETH/WETH rewards
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: aura.auraBrEthStableRewarder,
  },
  // Aura - wstETH/WETH rewards
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: aura.auraBstEthStableRewarder,
  },
  // Classic auraBAL staking rewards
  allow.mainnet.aura.auraBalStakingRewarder["getReward()"](),
  // Compounder auraBAL rewards
  allow.mainnet.aura.auraBalCompoundingRewarder["getReward()"](),
  // Aura - Lock rewards
  allow.mainnet.aura.vlAura["getReward(address)"](c.avatar),
  // Aura - Claim all rewards
  allow.mainnet.aura.claimZapV3.claimRewards(),

  // Compound v3 - cUSDCv3 - Claim rewards
  allow.mainnet.compoundV3.cometRewards.claim(contracts.mainnet.compoundV3.cUsdcV3, c.avatar),

  // Convex - USDT/WBTC/WETH rewards
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.cvxcrvUsdtWbtcWethRewarder,
  },
  // Convex - GHO/cbBTC/WETH rewards
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.cvxBtcGhoEthRewarder,
  },
  // Convex - Stake cvxCRV rewards
  allow.mainnet.convex.stkCvxCrv["getReward(address)"](c.avatar),
  // Convex - Claim all rewards
  allow.mainnet.convex.claimZap.claimRewards(),

  // Curve - USDT/WBTC/WETH rewards
  allow.mainnet.curve.crvUsdtWbtcWethGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.crvUsdtWbtcWethGauge),
  // Curve - Tricrypto GHO (GHO/cbBTC/ETH) rewards
  allow.mainnet.curve.btcGhoEthGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.btcGhoEthGauge),

] satisfies PermissionList