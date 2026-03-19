import { allow } from "zodiac-roles-sdk/kit"
import {
  WETH,
  kpk,
} from "@/addresses/eth"
import { PermissionList } from "@/types"


export default () => [
  {
    ...allow.mainnet.oiv.shares.processRequests(
      undefined,
      undefined,
      WETH,
    ),
    targetAddress: kpk.ethAlphaFundShares,
  },
] satisfies PermissionList
