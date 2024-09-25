import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "../../../../../eth-sdk/config"
import {
  DAI,
  GRT,
  sDAI,
  USDC,
  USDT,
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

const GRAPH_DELEGATEE = "0x5A8904be09625965d9AEc4BFfD30D853438a053e"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // // Aura - 50COW-50WETH
  // allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - Lock
  allowAction.aura.lock(),

  // Lido
  allowAction.lido.deposit(),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // CowSwap - DAI <> USDC
  allowAction.cowswap.swap({
    sell: [DAI],
    buy: [USDC],
  }),
  // CowSwap - DAI <> USDT
  allowAction.cowswap.swap({
    sell: [DAI],
    buy: [USDT],
  }),
  // CowSwap - USDC <> USDT
  allowAction.cowswap.swap({
    sell: [USDC],
    buy: [USDT],
  }),
  // CowSwap - sDAI <> USDC
  allowAction.cowswap.swap({
    sell: [sDAI],
    buy: [USDC],
  }),
  // CowSwap - sDAI <> USDT
  allowAction.cowswap.swap({
    sell: [sDAI],
    buy: [USDT],
  }),
  // CowSwap - vCOW
  allow.mainnet.cowswap.vCOW.swapAll(),

  // Spark - sDAI
  allowErc20Approve([DAI], [contracts.mainnet.spark.sDAI]),
  allow.mainnet.spark.sDAI.deposit(undefined, c.avatar),
  allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),

  // The Graph
  allowErc20Approve([GRT], [contracts.mainnet.the_graph.proxy]),
  // The delegate() is not in the proxy's ABI
  // The delegate() was added manually to the proxy ABI
  // The delegate() is called through the _fallback()
  // and by looking to the Internal Txns of a delegate() call
  // you can get the implementation where the delegate() is:
  // 0xA479c00cDa8C07bce458D7a826C7b091672EB92C
  allow.mainnet.the_graph.proxy.delegate(GRAPH_DELEGATEE),
  // The same happens with the undelegate()
  // From the research it seems the undelegate() is called
  // through the multicall(), but just in case we whitelist the direct call
  allow.mainnet.the_graph.proxy.undelegate(GRAPH_DELEGATEE),
  // Undelegate through multicall
  allow.mainnet.the_graph.proxy.multicall(
    c.every(
      c.calldataMatches(
        allow.mainnet.the_graph.proxy.undelegate(GRAPH_DELEGATEE)
      )
    )
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.the_graph.proxy.withdrawDelegated(
    GRAPH_DELEGATEE,
    ZERO_ADDRESS
  ),
] satisfies PermissionList
