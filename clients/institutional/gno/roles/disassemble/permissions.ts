import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { WXDAI, sDAI, USDC } from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v3 - Withdraw XDAI
  ...allowErc20Approve(
    [contracts.gnosis.aaveV3.aGnoWXDAI],
    [contracts.gnosis.aaveV3.wrappedTokenGatewayV3]
  ),
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.aaveV3.poolV3,
    undefined,
    c.avatar
  ),
  // Aave v3 - Withdraw WXDAI
  allow.gnosis.aaveV3.poolV3.withdraw(WXDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.gnosis.aaveV3.poolV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Repay XDAI
  allow.gnosis.aaveV3.wrappedTokenGatewayV3.repayETH(
    contracts.gnosis.aaveV3.poolV3,
    undefined,
    c.avatar,
    { send: true }
  ),
  // Aave v3 - Repay WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.aaveV3.poolV3]),
  allow.gnosis.aaveV3.poolV3.repay(WXDAI, undefined, undefined, c.avatar),
  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.aaveV3.poolV3]),
  allow.gnosis.aaveV3.poolV3.repay(USDC, undefined, undefined, c.avatar),

  // Spark - Withdraw DSR/sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  // Spark - Withdraw sDAI
  allow.gnosis.spark.poolV3.withdraw(sDAI, undefined, c.avatar),
  // Spark - Withdraw USDC
  allow.gnosis.spark.poolV3.withdraw(USDC, undefined, c.avatar),
  // Spark - Withdraw WXDAI
  allow.gnosis.spark.poolV3.withdraw(WXDAI, undefined, c.avatar),
  // Spark - Withdraw XDAI
  ...allowErc20Approve(
    [contracts.gnosis.spark.aWxdai],
    [contracts.gnosis.spark.wrappedTokenGatewayV3]
  ),
  allow.gnosis.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.spark.poolV3,
    undefined,
    c.avatar
  ),
  // Spark - Repay USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.spark.poolV3]),
  allow.gnosis.spark.poolV3.repay(USDC, undefined, undefined, c.avatar),
  // Spark - Repay WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.spark.poolV3]),
  allow.gnosis.spark.poolV3.repay(WXDAI, undefined, undefined, c.avatar),
  // Spark - Repay XDAI
  allow.gnosis.spark.wrappedTokenGatewayV3.repayETH(
    contracts.gnosis.spark.poolV3,
    undefined,
    undefined,
    c.avatar,
    { send: true }
  ),
] satisfies PermissionList
