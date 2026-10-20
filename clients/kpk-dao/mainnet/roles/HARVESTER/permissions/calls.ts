import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { fluid } from "@/addresses/eth"
import { Parameters } from "../../../parameters"
import { PermissionList } from "@/types"

export default (parameters: Parameters) =>
  [
    // Aave Safety Module - Claim stkAAVE rewards
    allow.mainnet.aaveV3.stkAave.claimRewards(c.avatar),

    // Fluid - FLUID Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
    },

    // Lido - Claim finalized withdrawals
    allow.mainnet.lido.unstEth.claimWithdrawal(),
    allow.mainnet.lido.unstEth.claimWithdrawals(),

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

    // Spark - Claim stkSPK rewards
    allow.mainnet.spark.stSpk.claim(c.avatar),
    allow.mainnet.spark.stSpk.claimBatch(c.avatar),
  ] satisfies PermissionList
