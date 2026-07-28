import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { fluid } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Fluid - FLUID Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
    },

    // Fluid - GHO Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.ghoRewards,
    },

    // Merkl - Rewards (MORPHO + incentives on Morpho positions)
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
