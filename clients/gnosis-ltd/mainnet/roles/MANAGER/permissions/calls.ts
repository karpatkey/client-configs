import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { AZUR, DAI, GRT, sDAI, USDC, USDT } from "@/addresses/eth"
import { zeroAddress } from "@/addresses"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { graphDelegatee, gnosisLtdArb } from "../../../addresses"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Azuro - AZUR Staking and Unstaking
  allowErc20Approve([AZUR], [contracts.mainnet.azuro.stAzur]),
  allow.mainnet.azuro.stAzur.depositFor(c.avatar),
  allow.mainnet.azuro.stAzur.requestWithdrawal(),
  allow.mainnet.azuro.stAzur.withdrawTo(c.avatar),

  // Compound v3 - Deposit USDC
  allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // CowSwap - vCOW
  allow.mainnet.cowSwap.vCow.swapAll(),

  // The Graph
  // The undelegate() was added manually to the staking contract ABI
  // The undelegate() is called through the _fallback()
  // and by looking to the Internal Txns of a undelegate() call
  // you can get the implementation where the undelegate() is:
  // 0xA479c00cDa8C07bce458D7a826C7b091672EB92C
  allow.mainnet.theGraph.staking.undelegate(graphDelegatee),
  allow.mainnet.theGraph.staking.unlockDelegationToTransferredIndexer(
    graphDelegatee
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.theGraph.staking.withdrawDelegated(graphDelegatee, zeroAddress),

  /*********************************************
   * Bridge
   *********************************************/
  allowErc20Approve([GRT], [contracts.mainnet.theGraph.proxy]),
  allow.mainnet.arbL1GatewayRouter.outboundTransfer(GRT, gnosisLtdArb),
] satisfies PermissionList
