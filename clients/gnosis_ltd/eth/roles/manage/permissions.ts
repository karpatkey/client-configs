import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "../../../../../eth-sdk/config"
import {
  AZUR,
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
const GNOSIS_LTD_ARB = "0x5B6e1AcD8494092C166b390C17f09694B9dDb42C"

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

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Azuro - AZUR Staking and Unstaking
  allowErc20Approve([AZUR], [contracts.mainnet.azuro.stAZUR]),
  allow.mainnet.azuro.stAZUR.depositFor(c.avatar),
  allow.mainnet.azuro.stAZUR.requestWithdrawal(),
  allow.mainnet.azuro.stAZUR.withdrawTo(c.avatar),

  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // CowSwap - vCOW
  allow.mainnet.cowswap.vCOW.swapAll(),

  // The Graph
  // The undelegate() was added manually to the staking contract ABI
  // The undelegate() is called through the _fallback()
  // and by looking to the Internal Txns of a undelegate() call
  // you can get the implementation where the undelegate() is:
  // 0xA479c00cDa8C07bce458D7a826C7b091672EB92C
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
   * Bridge
   *********************************************/
  allowErc20Approve([GRT], [contracts.mainnet.the_graph.proxy]),
  allow.mainnet.arb_l1_gateway_router.outboundTransfer(GRT, GNOSIS_LTD_ARB),
] satisfies PermissionList
