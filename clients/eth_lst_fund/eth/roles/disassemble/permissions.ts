import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { eETH, weETH, aura, balancer, convex } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { convexWithdraw } from "@/exit_strategies/convex"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import { balancerUnstakeWithdraw } from "@/exit_strategies/balancer"
import { Chain } from "@/types"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aura - rETH/WETH
  auraWithdrawBalancer(aura.auraBrEthStableRewarder, balancer.bREthStablePid),
  // Aura - osETH/WETH
  auraWithdrawBalancer(aura.auraosEthWethRewarder, balancer.osEthWethPid),

  // Balancer - rETH/WETH
  balancerUnstakeWithdraw(Chain.eth, balancer.bREthStableGauge),
  // Balancer - WETH/osETH
  balancerUnstakeWithdraw(Chain.eth, balancer.osEthWethGauge),

  // Convex - ETHx/ETH - ethx-f
  convexWithdraw(convex.cvxethxRewarder),
  // Convex - ankrETH/ETH
  convexWithdraw(convex.cvxankrCrvRewarder),

  // Curve - ETHx/ETH - ethx-f
  allow.mainnet.curve.ethxfPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.ethxfPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.ethxfPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.ethxfGauge["withdraw(uint256)"](),
  // Curve - ankrETH/ETH
  allow.mainnet.curve.ankrCrvPool.remove_liquidity(),
  allow.mainnet.curve.ankrCrvPool.remove_liquidity_imbalance(),
  allow.mainnet.curve.ankrCrvPool.remove_liquidity_one_coin(),
  allow.mainnet.curve.ankrCrvGauge.withdraw(),

  // ether.fi - Liquid ETH
  ...allowErc20Approve(
    [contracts.mainnet.etherfi.liquidEth],
    [contracts.mainnet.etherfi.atomicQueue]
  ),
  allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
    contracts.mainnet.etherfi.liquidEth,
    c.or(eETH, weETH)
  ),

  // Uniswap v3 - WETH/wstETH - cbETH/WETH
  allow.mainnet.uniswapV3.positionsNft.decreaseLiquidity(),
  allow.mainnet.uniswapV3.positionsNft.collect({
    recipient: c.avatar,
  }),
] satisfies PermissionList
