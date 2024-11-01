import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  WXDAI,
  sDAI,
  USDC,
  USDCe,
  E_ADDRESS,
  balancer,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: [E_ADDRESS, sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

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
  ...allowErc20Approve(
    [contracts.gnosis.aave_v3.aGnoWXDAI],
    [contracts.gnosis.aave_v3.wrapped_token_gateway_v3]
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
  // setUserUseReserveAsCollateral for WXDAI already included
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
  // Aave v3 - Borrow USDC
  allow.gnosis.aave_v3.pool_v3.borrow(
    USDC,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
  // USDC approval already included
  allow.gnosis.aave_v3.pool_v3.repay(USDC, undefined, undefined, c.avatar),

  // Spark - Deposit sDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.supply(sDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(sDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(sDAI),
  // Spark - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.supply(USDC, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(USDC, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(USDC),
  // Spark - Deposit WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.spark.sparkLendingPoolV3]),
  allow.gnosis.spark.sparkLendingPoolV3.supply(WXDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.withdraw(WXDAI, undefined, c.avatar),
  allow.gnosis.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(WXDAI),
  // Spark - Deposit XDAI
  allow.gnosis.spark.wrappedTokenGatewayV3.depositETH(
    contracts.gnosis.spark.sparkLendingPoolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [contracts.gnosis.spark.aWXDAI],
    [contracts.gnosis.spark.wrappedTokenGatewayV3]
  ),
  allow.gnosis.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.gnosis.spark.sparkLendingPoolV3,
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

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - USDT/sDAI/USDC Pool - Swap sDAI <-> USDC
  balancer__swap(balancer.sBAL3_pId, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - USDT/sDAI/USDC.e pool - Swap sDAI <-> USDC.e
  balancer__swap(balancer.sBAL3_2_pId, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDT/USDC/WXDAI pool - Swap USDC <-> WXDAI
  balancer__swap(balancer.staBAL3_pId, [USDC, WXDAI], [USDC, WXDAI]),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdai_bridge_2.relayTokens(c.avatar, {
    send: true,
  }),
  // XDAI (Gnosis) -> DAI (Mainnet) - HOP
  allow.gnosis.hop_dai_wrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),

  // // COMP (Gnosis) -> COMP (Mainnet)
  // allow.gnosis.comp.transferAndCall(
  //   contracts.gnosis.xdai_bridge,
  //   undefined,
  //   avatar
  // ),

  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    avatar
  ),
  // HOP does not work with USDC and USDC.e
] satisfies PermissionList
