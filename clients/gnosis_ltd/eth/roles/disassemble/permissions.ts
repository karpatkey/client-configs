import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, zeroAddress } from "../../../../../eth-sdk/addresses"
import { PermissionList } from "../../../../../types"
import {
  lidoUnstakeStEth,
  lidoUnwrapAndUnstakeWstEth,
} from "../../../../../helpers/exit_strategies"
import { graphDelegatee } from "../../../eth"

export default [
  // Aura - Lock
  allow.mainnet.aura.vlAura.processExpiredLocks(),

  // Azuro - AZUR Staking and Unstaking
  allow.mainnet.azuro.stAzur.requestWithdrawal(),
  allow.mainnet.azuro.stAzur.withdrawTo(c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Lido
  lidoUnstakeStEth(),
  lidoUnwrapAndUnstakeWstEth(),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),

  // The Graph
  allow.mainnet.theGraph.staking.undelegate(graphDelegatee),
  allow.mainnet.theGraph.staking.unlockDelegationToTransferredIndexer(
    graphDelegatee
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.theGraph.staking.withdrawDelegated(graphDelegatee, zeroAddress),
] satisfies PermissionList
