import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { SPY, USDG, kpk } from "@/addresses/robinhood"

export default [
  // KPK OIVs on Robinhood - request redemptions
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhUsdShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhEthShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      SPY,
      c.avatar
    ),
    targetAddress: kpk.kRhSpyShares,
  },
] satisfies PermissionList
