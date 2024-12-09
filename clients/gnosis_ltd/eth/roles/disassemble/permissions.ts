import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, zeroAddress } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import {
  lido__unstake_stETH,
  lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies"

const GRAPH_DELEGATEE = "0x5A8904be09625965d9AEc4BFfD30D853438a053e"

export default [
  // Aura - Lock
  allow.mainnet.aura.vlAura.processExpiredLocks(),

  // Azuro - AZUR Staking and Unstaking
  allow.mainnet.azuro.stAzur.requestWithdrawal(),
  allow.mainnet.azuro.stAzur.withdrawTo(c.avatar),

  // Compound v3 - USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Lido
  lido__unstake_stETH(),
  lido__unwrap_and_unstake_wstETH(),

  // Spark - DSR/sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),

  // The Graph
  allow.mainnet.theGraph.staking.undelegate(GRAPH_DELEGATEE),
  allow.mainnet.theGraph.staking.unlockDelegationToTransferredIndexer(
    GRAPH_DELEGATEE
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.theGraph.staking.withdrawDelegated(
    GRAPH_DELEGATEE,
    zeroAddress
  ),
] satisfies PermissionList
