import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { WBTC } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve as reserve } from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke

export default (parameters: Parameters) =>
  [
    // Aave v4 Bluechip Spoke - Post/pull WBTC collateral (Prime Hub) when the APPROVER
    // settles a subscription or a redemption. The Spoke pulls the asset from the
    // caller, hence the approval.
    allowErc20Approve([WBTC], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),
    // `supply` does not enable the reserve as collateral, it has to be set explicitly
    allow.mainnet.aaveV4.bluechipSpoke.setUsingAsCollateral(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),
  ] satisfies PermissionList
