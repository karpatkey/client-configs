import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { DAI, sDAI, USDC, WBTC, wstETH, morpho } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"

export default [
  // Aave v3 - Withdraw DAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 - Withdraw sDAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Repay DAI
  allowErc20Approve([DAI], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(DAI, undefined, undefined, c.avatar),
  // Aave v3 - Repay USDC
  allowErc20Approve([USDC], [contracts.mainnet.aaveV3.poolCoreV3]),
  allow.mainnet.aaveV3.poolCoreV3.repay(USDC, undefined, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Morpho Market - USDC/wstETH - id: 0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc
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
  // Morpho Market - USDC/WBTC - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdc,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

  // Sky - Withdraw DSR (DAI Savings Rate)
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),

  // Spark - Withdraw DSR/sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - Withdraw sDAI
  allow.mainnet.spark.poolV3.withdraw(sDAI, undefined, c.avatar),
  // Spark - Repay DAI
  allowErc20Approve([DAI], [contracts.mainnet.spark.poolV3]),
  allow.mainnet.spark.poolV3.repay(DAI, undefined, undefined, c.avatar),
  // Spark - Repay USDC
  allowErc20Approve([USDC], [contracts.mainnet.spark.poolV3]),
  allow.mainnet.spark.poolV3.repay(USDC, undefined, undefined, c.avatar),
] satisfies PermissionList
