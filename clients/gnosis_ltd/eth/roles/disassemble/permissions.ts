import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "../../../../../eth-sdk/config"
import {
  E_ADDRESS,
  DAI,
  rETH,
  sDAI,
  stETH,
  USDC,
  USDT,
  WETH,
  wstETH,
  balancer,
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import {
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies/lido"
import { cowswap__swap } from "../../../../../helpers/exit_strategies/cowswap"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"
import { Chain } from "../../../../../types"

const GRAPH_DELEGATEE = "0x5A8904be09625965d9AEc4BFfD30D853438a053e"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Aura - Lock
  allow.mainnet.aura.vlAURA.processExpiredLocks(),

  // Azuro - AZUR Staking and Unstaking
  allow.mainnet.azuro.stAZUR.requestWithdrawal(),
  allow.mainnet.azuro.stAZUR.withdrawTo(c.avatar),

  // Compound v3 - USDC
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Spark - DSR/sDAI
  allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),

  // The Graph
  allow.mainnet.the_graph.staking.undelegate(GRAPH_DELEGATEE),
  allow.mainnet.the_graph.staking.unlockDelegationToTransferredIndexer(
    GRAPH_DELEGATEE
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.the_graph.staking.withdrawDelegated(
    GRAPH_DELEGATEE,
    ZERO_ADDRESS
  ),

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - Swap rETH <-> WETH
  balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [wstETH, WETH]),

  // CowSwap - DAI -> [USDC, USDT, E_ADDRESS]
  cowswap__swap([DAI], [USDC, USDT, E_ADDRESS], Chain.eth),

  // CowSwap - USDT -> [USDC, DAI, E_ADDRESS]
  cowswap__swap([USDT], [USDC, DAI, E_ADDRESS], Chain.eth),

  // Cowswap - USDC -> [DAI, USDT, E_ADDRESS]
  cowswap__swap([USDC], [DAI, USDT, E_ADDRESS], Chain.eth),

  // Cowswap - [ETH, WETH] -> [DAI, USDT, USDC]
  cowswap__swap([E_ADDRESS, WETH], [DAI, USDT, USDC], Chain.eth),

  // CowSwap - DAI <> USDC
  cowswap__swap([DAI, USDC], [DAI, USDC], Chain.eth),

  // CowSwap - DAI <> USDT
  cowswap__swap([DAI, USDT], [DAI, USDT], Chain.eth),

  // CowSwap - USDC <> USDT
  cowswap__swap([USDC, USDT], [USDC, USDT], Chain.eth),

  // CowSwap - sDAI <> USDC
  cowswap__swap([sDAI, USDC], [sDAI, USDC], Chain.eth),

  // CowSwap - sDAI <> USDT
  cowswap__swap([sDAI, USDT], [sDAI, USDT], Chain.eth),

  // Curve - Swaps in 3pool
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool["exchange"](),

  // Curve - Swap ETH/stETH (steCRV)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool["exchange"](),

  // Curve - Swaps ETH/stETH (stETH-ng-f)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stETH_ng_f_pool]),
  allow.mainnet.curve.stETH_ng_f_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Uniswap V3 - Swaps
  ...allowErc20Approve(
    [DAI, USDC, USDT, WETH, wstETH],
    [contracts.mainnet.uniswap_v3.router_2]
  ),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle(
    {
      tokenIn: c.or(DAI, USDC, USDT, WETH, wstETH),
      tokenOut: c.or(DAI, USDC, USDT, WETH, wstETH),
      recipient: c.avatar,
    },
    {
      send: true,
    }
  ),
] satisfies PermissionList
