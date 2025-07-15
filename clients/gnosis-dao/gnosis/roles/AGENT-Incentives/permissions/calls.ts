import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Approve } from "@/helpers"
import { wstETH } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { encodeBytes32String } from "defi-kit"

export default [
  allowErc20Approve([wstETH], [contracts.gnosis.curve.crvEureUsdGauge]),
  allow.gnosis.curve.crvEureUsdGauge.deposit_reward_token(
    wstETH,
    c.withinAllowance(
      encodeBytes32String("curve_gauge_amount") as `0x${string}`
    )
  ),
] satisfies PermissionList
