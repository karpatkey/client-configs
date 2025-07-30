import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../mainnet/parameters"

export default (parameters: Parameters) =>
  [
    {
      ...allow.mainnet.oiv.shares.processDepositRequests(),
      targetAddress: parameters.shares,
    },
    {
      ...allow.mainnet.oiv.shares.processRedeemRequests(),
      targetAddress: parameters.shares,
    },
    {
      ...allow.mainnet.oiv.navCalculator.bridgeStart(),
      targetAddress: parameters.navCalculator,
    },
    {
      ...allow.mainnet.oiv.navCalculator.bridgeFinalize(),
      targetAddress: parameters.navCalculator,
    },
  ] satisfies PermissionList
