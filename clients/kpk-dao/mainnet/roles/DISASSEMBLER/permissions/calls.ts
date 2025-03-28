import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  rETH,
  USDC,
  USDT,
  stETH,
  WETH,
  wstETH,
  aura,
  balancerV2,
  convex,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import {
  lidoUnstakeStEth,
  lidoUnwrapAndUnstakeWstEth,
} from "@/exit_strategies/lido"
import { convexWithdraw } from "@/exit_strategies/convex"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave Safety Module - Unstake AAVE and GHO
  allow.mainnet.aaveV2.stkAave.redeem(c.avatar),
  allow.mainnet.aaveV2.stkAave.cooldown(),
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aura - wstETH/WETH
  auraWithdrawBalancer(
    aura.auraBstEthStableRewarder,
    balancerV2.bStEthStablePid
  ),

  // Aura - Lock
  allow.mainnet.aura.vlAura.processExpiredLocks(),

  // Aura - Stake
  allow.mainnet.aura.auraBalStakingRewarder.withdraw(),
  allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),

  allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Convex - USDT/WBTC/WETH
  convexWithdraw(convex.cvxcrvUsdtWbtcWethRewarder),

  // Convex - GHO/WBTC/wstETH
  convexWithdraw(convex.cvxGhoBtcWstEthRewarder),

  // Curve - USDT/WBTC/WETH
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  allow.mainnet.curve.crvUsdtWbtcWethGauge["withdraw(uint256)"](),

  // Curve - Tricrypto GHO (GHO/WBTC/wstETH)
  allow.mainnet.curve.ghoBtcWstePool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.ghoBtcWstePool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  allow.mainnet.curve.ghoBtcWsteGauge["withdraw(uint256)"](),

  // Enzyme - Diva stETH Vault
  // Withdraw stETH
  allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.divaStEthVault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
  ),

  // Lido
  lidoUnstakeStEth(),
  lidoUnwrapAndUnstakeWstEth(),

  // pods - ETHphoria Vault
  // Withdraw stETH
  allow.mainnet.pods.ethoriaVault.redeem(undefined, c.avatar, c.avatar),

  // Rocket Pool
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),

  // Sky - DSR (DAI Savings Rate)
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - rETH <-> WETH
  balancerV2Swap(balancerV2.bREthStablePid, [rETH, WETH], [rETH, WETH]),

  // Balancer - WETH <-> wstETH
  balancerV2Swap(balancerV2.bStEthStablePid, [WETH, wstETH], [wstETH, WETH]),

  // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool["exchange"](),

  // Curve - ETH <-> stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool["exchange"](),

  // Curve - ETH <-> stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stEthNgfPool]),
  allow.mainnet.curve.stEthNgfPool["exchange(int128,int128,uint256,uint256)"](),

  // Uniswap V3 - [DAI, USDC, USDT, WETH, wstETH] <-> [DAI, USDC, USDT, WETH, wstETH]
  ...allowErc20Approve(
    [DAI, USDC, USDT, WETH, wstETH],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDT, WETH, wstETH),
    tokenOut: c.or(DAI, USDC, USDT, WETH, wstETH),
    recipient: c.avatar,
  }),
] satisfies PermissionList
