import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave Incentives rewards
    allow.mainnet.aaveV3.incentivesV3.claimRewards(
      undefined,
      undefined,
      c.avatar
    ),

    // Compound v3 - cUSDCv3 - Claim rewards
    allow.mainnet.compoundV3.cometRewards.claim(
      contracts.mainnet.compoundV3.cUsdcV3,
      c.avatar
    ),

    // Morpho - Claim Rewards
    allow.mainnet.morpho.universalRewardsDistributor.claim(c.avatar),
    // Morpho Claim Rewards (through Merkle)
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
