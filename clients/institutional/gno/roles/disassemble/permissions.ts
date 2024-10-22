import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  WXDAI,
  sDAI,
  USDC,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v3 - Withdraw XDAI
  ...allowErc20Approve(
    [contracts.gnosis.aave_v3.aGnoWXDAI],
    [contracts.gnosis.aave_v3.wrapped_token_gateway_v3]
  ),
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.gnosis.aave_v3.pool_v3,
    undefined,
    c.avatar
  ),
  // Aave v3 - Withdraw WXDAI
  allow.gnosis.aave_v3.pool_v3.withdraw(WXDAI, undefined, c.avatar),
  // Aave v3 - Withdraw USDC
  allow.gnosis.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - Repay XDAI
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.repayETH(
    contracts.gnosis.aave_v3.pool_v3,
    undefined,
    undefined,
    c.avatar,
    { send: true }
  ),
  // Aave v3 - Repay WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.aave_v3.pool_v3]),
  allow.gnosis.aave_v3.pool_v3.repay(WXDAI, undefined, undefined, c.avatar),
  // Aave v3 - Repay USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.aave_v3.pool_v3]),
  allow.gnosis.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

  // Spark - Withdraw DSR/sDAI
  allow.gnosis.spark.SavingsXDaiAdapter.depositXDAI(c.avatar, {
    send: true,
  }),
  allow.gnosis.spark.SavingsXDaiAdapter.redeem(undefined, c.avatar),
  // Spark - Withdraw sDAI
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  // Spark - Withdraw USDC
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(USDC, undefined, c.avatar),
  // Spark - Withdraw WXDAI
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(WXDAI, undefined, c.avatar),
  // Spark - Withdraw XDAI
  ...allowErc20Approve(
    [contracts.gnosis.spark.aWXDAI],
    [contracts.gnosis.spark.wrappedTokenGatewayV3]
  ),
  allow.gnosis.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.spark.sparkLendingPoolV3,
    undefined,
    c.avatar
  ),
  // Spark - Repay USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.repay(
    USDC,
    undefined,
    undefined,
    c.avatar
  ),
  // Spark - Repay WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.repay(
    WXDAI,
    undefined,
    undefined,
    c.avatar
  ),
  // Spark - Repay XDAI
  allow.gnosis.spark.wrappedTokenGatewayV3.repayETH(
    contracts.gnosis.spark.sparkLendingPoolV3,
    undefined,
    undefined,
    c.avatar,
    { send: true }
  )
] satisfies PermissionList