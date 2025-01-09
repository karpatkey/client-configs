import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  CRV,
  COMP,
  CVX,
  DAI,
  NOTE,
  rETH,
  USDC,
  USDT,
  stETH,
  WETH,
  wstETH,
  aura,
  balancer,
  convex,
  eAddress,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { auraWithdrawBalancer } from "../../../../../helpers/exit_strategies/aura"
import { balancerSwap } from "../../../../../helpers/exit_strategies/balancer"
import { cowswapSwap } from "../../../../../helpers/exit_strategies/cowswap"
import {
  lidoUnstakeStEth,
  lidoUnwrapAndUnstakeWstEth,
} from "../../../../../helpers/exit_strategies/lido"
import { convexWithdraw } from "../../../../../helpers/exit_strategies/convex"
import { Chain } from "../../../../../types"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v2 - Staking of AAVE and GHO in Safety Module
  allow.mainnet.aaveV2.stkAave.redeem(c.avatar),
  allow.mainnet.aaveV2.stkAave.cooldown(),
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aura - wstETH/WETH
  auraWithdrawBalancer(aura.auraBstEthStableRewarder, balancer.bStEthStablePid),

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
  allow.mainnet.curve.tricryptoGhoPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.tricryptoGhoPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  allow.mainnet.curve.tricryptoGhoGauge["withdraw(uint256)"](),

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

  // Maker - DSR (DAI Savings Rate)
  allow.mainnet.maker.dsrManager.exit(c.avatar),
  allow.mainnet.maker.dsrManager.exitAll(c.avatar),

  // pods - ETHphoria Vault
  // Withdraw stETH
  allow.mainnet.pods.ethoriaVault.redeem(undefined, c.avatar, c.avatar),

  // Rocket Pool
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - Swap rETH <-> WETH
  balancerSwap(balancer.bREthStablePid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap WETH <-> wstETH
  balancerSwap(balancer.bStEthStablePid, [WETH, wstETH], [wstETH, WETH]),

  // CowSwap - Holdings
  cowswapSwap([DAI, USDC, USDT], [DAI, USDC, USDT, WETH], Chain.eth),
  cowswapSwap([CRV, COMP, CVX, NOTE], [DAI, USDC], Chain.eth),

  // CowSwap - DAI -> [ETH, USDC, USDT]
  cowswapSwap([DAI], [eAddress, USDC, USDT], Chain.eth),

  // CowSwap - USDT -> [USDC, DAI, eAddress]
  cowswapSwap([USDT], [USDC, DAI, eAddress], Chain.eth),

  // Cowswap - USDC -> [DAI, USDT, eAddress]
  cowswapSwap([USDC], [DAI, USDT, eAddress], Chain.eth),

  // Cowswap - [ETH, WETH] -> [DAI, USDT, USDC]
  cowswapSwap([eAddress, WETH], [DAI, USDT, USDC], Chain.eth),

  // Curve - Swaps in 3pool
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool["exchange"](),

  // Curve - Swap ETH/stETH (steCRV)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool["exchange"](),

  // Curve - Swaps ETH/stETH (stETH-ng-f)
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stEthNgfPool]),
  allow.mainnet.curve.stEthNgfPool["exchange(int128,int128,uint256,uint256)"](),

  // Uniswap V3 - Swaps
  ...allowErc20Approve(
    [DAI, USDC, USDT, WETH, wstETH],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle(
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
