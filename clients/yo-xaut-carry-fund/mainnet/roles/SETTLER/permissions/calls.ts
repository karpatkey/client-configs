import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { XAUt } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// process_subscriptions_aave and process_redemptions_aave post and pull the XAUt collateral on
// Aave v3 Core for the avatar. Hand-scoped rather than defi-kit's aave_v3.deposit, which would
// also let the role toggle XAUt as collateral and claim rewards: neither settler automation
// sends those. The Pool pulls XAUt on supply, hence the approval.
export default (parameters: Parameters) =>
  [
    allowErc20Approve([XAUt], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.supply(XAUt, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(XAUt, undefined, c.avatar),
  ] satisfies PermissionList
