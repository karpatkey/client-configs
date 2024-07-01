import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  WXDAI,
  sDAI,
  USDC,
  USDCe,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Cowswap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [COMP, sDAI, USDC, WXDAI],
    buy: [E_ADDRESS, sDAI, USDC, WXDAI],
  }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // Aave v3 - Deposit XDAI
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.depositETH(
    contracts.gnosis.aave_v3.pool_v3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.gnosis.aave_v3.pool_v3,
    undefined,
    c.avatar
  ),
  allow.gnosis.aave_v3.pool_v3.setUserUseReserveAsCollateral(WXDAI),
  // Aave v3 - Deposit WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.aave_v3.pool_v3]),
  allow.gnosis.aave_v3.pool_v3.supply(WXDAI, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.withdraw(WXDAI, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.setUserUseReserveAsCollateral(WXDAI),
  // Aave v3 - Deposit sDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.aave_v3.pool_v3]),
  allow.gnosis.aave_v3.pool_v3.supply(sDAI, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.withdraw(sDAI, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.setUserUseReserveAsCollateral(sDAI),
  // Aave v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.aave_v3.pool_v3]),
  allow.gnosis.aave_v3.pool_v3.supply(USDC, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),
  allow.gnosis.aave_v3.pool_v3.setUserUseReserveAsCollateral(USDC),
  // Aave v3 - Borrow XDAI
  allow.gnosis.aave_v3.variable_debt_wxdai.approveDelegation(
    contracts.gnosis.aave_v3.wrapped_token_gateway_v3
  ),
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.borrowETH(
    contracts.gnosis.aave_v3.pool_v3
  ),
  allow.gnosis.aave_v3.wrapped_token_gateway_v3.repayETH(
    contracts.gnosis.aave_v3.pool_v3,
    undefined,
    undefined,
    c.avatar,
    { send: true }
  ),
  // Aave v3 - Borrow WXDAI
  allow.gnosis.aave_v3.pool_v3.borrow(
    WXDAI,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
  // WXDAI approval already included
  allow.gnosis.aave_v3.pool_v3.repay(WXDAI, undefined, undefined, c.avatar),

  // Agave - sDAI
  // Deposit XDAI
  allow.gnosis.agave.SavingsXDaiAdapter.depositXDAI(c.avatar, {
    send: true,
  }),
  // Withdraw XDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.redeemXDAI(undefined, c.avatar),

  // Agave - sDAI - Deposit and Withdraw WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.deposit(undefined, c.avatar),
  // Withdraw WXDAI
  // sDAI approval with SavingsXDaiAdapter as spender already whitelisted
  allow.gnosis.agave.SavingsXDaiAdapter.redeem(undefined, c.avatar),

  // Spark - Deposit sDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.supply(sDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(sDAI),
  // Spark - Borrow XDAI
  allow.gnosis.spark.variableDebtWXDAI.approveDelegation(
    contracts.gnosis.spark.wrappedTokenGatewayV3
  ),
  allow.gnosis.spark.wrappedTokenGatewayV3.borrowETH(
    contracts.gnosis.spark.sparkLendingPoolV3
  ),
  allow.gnosis.spark.wrappedTokenGatewayV3.repayETH(
    contracts.gnosis.spark.sparkLendingPoolV3,
    undefined,
    undefined,
    c.avatar,
    { send: true }
  ),
  // Spark - Borrow WXDAI
  allow.gnosis.spark.sparkLendingPoolV3.borrow(
    WXDAI,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
  ...allowErc20Approve([WXDAI], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.repay(
    WXDAI,
    undefined,
    undefined,
    c.avatar
  ),
  // Spark - Borrow USDC
  allow.gnosis.spark.sparkLendingPoolV3.borrow(
    USDC,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
  ...allowErc20Approve([USDC], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.repay(
    USDC,
    undefined,
    undefined,
    c.avatar
  ),

  // Balancer - USDT/sDAI/USDC pool - Swap sDAI <-> USDC
  ...allowErc20Approve([sDAI, USDC], [contracts.mainnet.balancer.vault]),
  // Swap sDAI for USDC
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
      assetIn: sDAI,
      assetOut: USDC,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),
  // Swap USDC for sDAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
      assetIn: USDC,
      assetOut: sDAI,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - USDT/sDAI/USDC.e pool - Swap sDAI <-> USDC.e
  ...allowErc20Approve([sDAI, USDCe], [contracts.mainnet.balancer.vault]),
  // Swap sDAI for USDC.e
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xfc095c811fe836ed12f247bcf042504342b73fb700000000000000000000009f",
      assetIn: sDAI,
      assetOut: USDCe,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),
  // Swap USDC.e for sDAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
      assetIn: USDCe,
      assetOut: sDAI,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.withdraw(),

  // Bridge - Gnosis -> Mainnet
  // XDAI -> DAI
  allow.gnosis.xdai_bridge_2.relayTokens(c.avatar),
  // COMP (Gnosis) -> COMP (Mainnet)
  allow.gnosis.comp.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    c.avatar.toString()
  ),
  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    c.avatar.toString()
  ),
] satisfies PermissionList
