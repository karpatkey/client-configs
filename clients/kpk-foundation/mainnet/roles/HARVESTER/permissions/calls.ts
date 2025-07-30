import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { PermissionList } from "@/types"

export default [
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
] satisfies PermissionList
