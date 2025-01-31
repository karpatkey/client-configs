import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "@/contracts"
import { AZUR, DAI, GRT, sDAI, USDC, USDT, zeroAddress } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"
import { graphDelegatee, gnosisLtdArb } from "../../../eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - Lock
  allowAction.aura.lock(),

  // CowSwap - DAI <-> USDC
  allowAction.cowswap.swap({
    sell: [DAI, USDC],
    buy: [DAI, USDC],
  }),
  // CowSwap - DAI <-> USDT
  allowAction.cowswap.swap({
    sell: [DAI, USDT],
    buy: [DAI, USDT],
  }),
  // CowSwap - USDC <-> USDT
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
  // CowSwap - sDAI <-> USDC
  allowAction.cowswap.swap({
    sell: [sDAI, USDC],
    buy: [sDAI, USDC],
  }),
  // CowSwap - sDAI <-> USDT
  allowAction.cowswap.swap({
    sell: [sDAI, USDT],
    buy: [sDAI, USDT],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

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
