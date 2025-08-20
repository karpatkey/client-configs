import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { USDC, wstETH, morpho } from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Compound v3 - Deposit USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Morpho Blue - wstETH/USDC
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.oracleWstEthUsdc,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
