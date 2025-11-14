import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { cbETH, USDC, morpho } from "@/addresses/base"
import { PermissionList } from "@/types"

export default [
  // Aave v3 - Withdraw USDC
  allow.base.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),

  // Morpho Market - USDC/cbETH - id: 0x1c21c59df9db44bf6f645d854ee710a8ca17b479451447e9f56758aee10a2fad
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.oracleCbEthUsdc,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
