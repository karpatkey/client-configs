import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { contracts } from "../../../../eth-sdk/config"
import { DAI, GRT, USDC, ZERO_ADDRESS } from "../../../../eth-sdk/addresses"
import { avatar } from "../../index"
import { allowErc20Approve } from "../../../../utils/erc20"
import { PermissionList } from "../../../../types"

const GRAPH_DELEGATEE = "0x5A8904be09625965d9AEc4BFfD30D853438a053e"

export default [
  // Use defi-kit to generate the permissions...
  // Lido
  allowAction.lido.deposit(),

  // Compound v3 - USDC
  allowAction.compound_v3.deposit({ targets: ["cUSDCv3"] }),

  // Aura - 50COW-50WETH
  allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Lido
  allowAction.lido.deposit(),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // CowSwap - vCOW
  allow.mainnet.cowswap.vCOW.swapAll(),

  // Spark - sDAI
  allowErc20Approve([DAI], [contracts.mainnet.spark.sDAI]),
  allow.mainnet.spark.sDAI.deposit(undefined, avatar),
  allow.mainnet.spark.sDAI.redeem(undefined, avatar, avatar),

  // The Graph
  allowErc20Approve([GRT], [contracts.mainnet.the_graph.proxy]),
  // The delegate() is not in the abi of the proxy.
  // The delegate() was added to the proxy abi manually.
  // The delegate() is called through the _fallback()
  // and by looking to the Internal Txns of a delegate() call
  // you can the implementation where de delegate() is:
  // 0xA479c00cDa8C07bce458D7a826C7b091672EB92C
  allow.mainnet.the_graph.proxy.delegate(GRAPH_DELEGATEE),
  // The same happens with the undelegate()
  // From the research it seems the undelegate() is called
  // through the multicall(), but just in case we whitelist the direct call
  allow.mainnet.the_graph.proxy.undelegate(GRAPH_DELEGATEE),
  // Undelegate through multicall
  allow.mainnet.the_graph.proxy.multicall(
    c.calldataMatches(allow.mainnet.the_graph.proxy.undelegate(GRAPH_DELEGATEE))
  ),
  // Withdraw GRT
  // _newIndexer Re-delegate to indexer address if non-zero, withdraw if zero address
  allow.mainnet.the_graph.proxy.withdrawDelegated(
    GRAPH_DELEGATEE,
    ZERO_ADDRESS
  ),
] satisfies PermissionList
