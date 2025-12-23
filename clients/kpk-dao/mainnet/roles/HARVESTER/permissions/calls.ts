import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { aura, balancerV2, convex } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { lidoVestingEscrow } from "../../../addresses"
import { Parameters } from "../../../parameters"
import { PermissionList } from "@/types"

export default (parameters: Parameters) =>
  [
    // Aave Safety Module - Stake AAVE rewards
    allow.mainnet.aaveV3.stkAave.claimRewards(c.avatar),
    // Aave Safety Module - Stake GHO rewards
    allow.mainnet.aaveV3.stkGho.claimRewards(c.avatar),
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

    // Balancer v2 - rETH/WETH rewards
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV2.bREthStableGauge,
    },
    {
      ...allow.mainnet.balancerV2.minter.mint(balancerV2.bREthStableGauge),
      targetAddress: contracts.mainnet.balancerV2.minter,
    },
    // Balancer v2 - wstETH/WETH rewards
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV2.bStEthStableGauge,
    },
    {
      ...allow.mainnet.balancerV2.minter.mint(balancerV2.bStEthStableGauge),
      targetAddress: contracts.mainnet.balancerV2.minter,
    },

    // Compound v3 - cUSDCv3 - Claim rewards
    allow.mainnet.compoundV3.cometRewards.claim(
      contracts.mainnet.compoundV3.cUsdcV3,
      c.avatar
    ),

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
    allow.mainnet.curve.crvMinter.mint(
      contracts.mainnet.curve.crvUsdtWbtcWethGauge
    ),
    // Curve - Tricrypto GHO (GHO/cbBTC/ETH) rewards
    allow.mainnet.curve.btcGhoEthGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.btcGhoEthGauge),

    // ether.fi - Claim rewards
    allow.mainnet.etherfi.kingDistributor.claim(c.avatar),

    // Lido - Lido's Token Rewards Plan (TRP) - Claim LDO
    {
      ...allow.mainnet.lido.vestingEscrow["claim(address,uint256)"](c.avatar),
      targetAddress: lidoVestingEscrow,
    },

    // Merkl - Rewards
    allow.mainnet.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
    ),
  ] satisfies PermissionList
