import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { fluid } from "@/addresses/eth"
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

    // Fluid - Claim rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
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
