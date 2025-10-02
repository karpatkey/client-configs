import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  BRLA,
  EURCe,
  EURe,
  GHO,
  GNO,
  SAFE,
  sDAI,
  USDC,
  USDCe,
  USDCE,
  USDT,
  WBTC,
  WETH,
  wstETH,
  WXDAI,
  ZCHF,
  balancerV3,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowEthTransfer,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"
import {
  gnosisDaoIaGno,
  gnosisDaoLmGno,
  gnosisDaoLpGno,
  gnosisDaoIaEth,
  gpRewardsGno,
  aveniaGno,
  dfwLtdGno,
} from "../../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  // Balancer v3 - Aave Lido Boosted USDC.e/GHO
  allowErc20Approve([GHO, USDCe], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(GHO, USDCe),
    contracts.gnosis.balancerV3.compositeLiquidityRouter
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    balancerV3.aaveUsdceGho
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    balancerV3.aaveUsdceGho
  ),
  allowErc20Approve(
    [balancerV3.aaveUsdceGho],
    [contracts.gnosis.balancerV3.compositeLiquidityRouter]
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    balancerV3.aaveUsdceGho
  ),

  // Balancer v3 - sDAI/BRLA
  allowErc20Approve([BRLA, sDAI], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(BRLA, sDAI),
    contracts.gnosis.balancerV3.router
  ),
  allow.gnosis.balancerV3.router.addLiquidityProportional(balancerV3.brlaSdai),
  allow.gnosis.balancerV3.router.addLiquidityUnbalanced(balancerV3.brlaSdai),
  allowErc20Approve(
    [balancerV3.brlaSdai],
    [contracts.gnosis.balancerV3.router]
  ),
  allow.gnosis.balancerV3.router.removeLiquidityProportional(
    balancerV3.brlaSdai
  ),
  allow.gnosis.balancerV3.router.removeLiquiditySingleTokenExactIn(
    balancerV3.brlaSdai
  ),

  // Balancer v3 - Aave Lido Boosted WETH/wstETH
  allowErc20Approve([WETH, wstETH], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(WETH, wstETH),
    contracts.gnosis.balancerV3.compositeLiquidityRouter
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    balancerV3.aaveLidoWethWstEth
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    balancerV3.aaveLidoWethWstEth
  ),
  allowErc20Approve(
    [balancerV3.aaveLidoWethWstEth],
    [contracts.gnosis.balancerV3.compositeLiquidityRouter]
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    balancerV3.aaveLidoWethWstEth
  ),
  allowErc20Approve(
    [balancerV3.aaveLidoWethWstEth],
    [balancerV3.aaveLidoWethWstEthGauge]
  ),
  {
    ...allow.gnosis.balancerV2.gauge["deposit(uint256)"](),
    targetAddress: balancerV3.aaveLidoWethWstEthGauge,
  },
  {
    ...allow.gnosis.balancerV2.gauge["withdraw(uint256)"](),
    targetAddress: balancerV3.aaveLidoWethWstEthGauge,
  },
  {
    ...allow.gnosis.balancerV2.gauge["claim_rewards()"](),
    targetAddress: balancerV3.aaveLidoWethWstEthGauge,
  },
  allow.gnosis.balancerV2.minter.mint(balancerV3.aaveLidoWethWstEth),

  // Balancer v3 - reCLAMM wstETH/GNO
  allowErc20Approve([GNO, wstETH], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(GNO, wstETH),
    contracts.gnosis.balancerV3.router
  ),
  allow.gnosis.balancerV3.router.addLiquidityProportional(
    balancerV3.reClammWstEthGno
  ),
  allow.gnosis.balancerV3.router.addLiquidityUnbalanced(
    balancerV3.reClammWstEthGno
  ),
  allowErc20Approve(
    [balancerV3.reClammWstEthGno],
    [contracts.gnosis.balancerV3.router]
  ),
  allow.gnosis.balancerV3.router.removeLiquidityProportional(
    balancerV3.reClammWstEthGno
  ),
  allow.gnosis.balancerV3.router.removeLiquiditySingleTokenExactIn(
    balancerV3.reClammWstEthGno
  ),

  // Balancer v3 - reCLAMM GNO/USDC.e
  allowErc20Approve([GNO, USDCe], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(GNO, USDCe),
    contracts.gnosis.balancerV3.router
  ),
  allow.gnosis.balancerV3.router.addLiquidityProportional(
    balancerV3.reClammGnoUsdce
  ),
  allow.gnosis.balancerV3.router.addLiquidityUnbalanced(
    balancerV3.reClammGnoUsdce
  ),
  allowErc20Approve(
    [balancerV3.reClammGnoUsdce],
    [contracts.gnosis.balancerV3.router]
  ),
  allow.gnosis.balancerV3.router.removeLiquidityProportional(
    balancerV3.reClammGnoUsdce
  ),
  allow.gnosis.balancerV3.router.removeLiquiditySingleTokenExactIn(
    balancerV3.reClammGnoUsdce
  ),

  // Curve - EURe/EURC.e
  allowErc20Approve([EURCe, EURe], [contracts.gnosis.curve.eureEurc]),
  allow.gnosis.curve.eureEurc["add_liquidity(uint256[],uint256)"](),
  allow.gnosis.curve.eureEurc["remove_liquidity(uint256,uint256[])"](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),

  // Pooltogether - Prize WXDAI / DAI Savings Rate
  allowErc20Approve([WXDAI], [contracts.gnosis.pooltogether.przWxdai]),
  allow.gnosis.pooltogether.przWxdai.deposit(undefined, c.avatar),
  // This is the function used by the UI
  allow.gnosis.pooltogether.przWxdai[
    "withdraw(uint256,address,address,uint256)"
  ](undefined, c.avatar, c.avatar),
  allow.gnosis.pooltogether.przWxdai["withdraw(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.gnosis.pooltogether.przWxdai["redeem(uint256,address,address,uint256)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.gnosis.pooltogether.przWxdai["redeem(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.gnosis.pooltogether.prizePoolTwabRewards.claimRewards(
    contracts.gnosis.pooltogether.przWxdai,
    c.avatar
  ),

  // Uniswap v3 / Oku Trade - EURe + sDAI
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(EURe, sDAI),
    c.or(EURe, sDAI)
  ),
  // Uniswap v3 / Oku Trade - EURe + ZCHF
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(EURe, ZCHF),
    c.or(EURe, ZCHF)
  ),
  // Uniswap v3 / Oku Trade - USDC.e + EURe
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(USDCe, EURe),
    c.or(USDCe, EURe)
  ),
  // Uniswap v3 / Oku Trade - USDC.e + GHO
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(USDCe, GHO),
    c.or(USDCe, GHO)
  ),
  // Uniswap v3 / Oku Trade - USDC.e + sDAI
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(USDCe, sDAI),
    c.or(USDCe, sDAI)
  ),
  // Uniswap v3 / Oku Trade - USDC.e + USDC.e (Lucid Labs)
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(USDCe, USDCE),
    c.or(USDCe, USDCE)
  ),
  // Uniswap v3 / Oku Trade - USDC.e + WXDAI
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(USDCe, WXDAI),
    c.or(USDCe, WXDAI)
  ),
  // Uniswap v3 / Oku Trade - wstETH + GNO
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(wstETH, GNO),
    c.or(wstETH, GNO)
  ),
  // Uniswap v3 / Oku Trade - wstETH + sDAI
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(wstETH, sDAI),
    c.or(wstETH, sDAI)
  ),
  // Uniswap v3 / Oku Trade - wstETH + WETH
  allow.gnosis.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
    c.or(wstETH, WETH),
    c.or(wstETH, WETH)
  ),

  /*********************************************
   * Swaps
   *********************************************/
  // Swap USDC.e -> USDC
  allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  allowErc20Approve([USDC], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // Gnosis -> Mainnet
  // GNO - Gnosis Bridge
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    gnosisDaoIaEth
  ),

  // SAFE - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: SAFE,
  },

  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    gnosisDaoIaEth
  ),

  // USDT - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: USDT,
  },

  // WBTC - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: WBTC,
  },

  // WETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: WETH,
  },

  // wstETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: wstETH,
  },

  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(gnosisDaoIaEth, {
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 500 GNO every 24 hours to gpRewardsGno
  allowErc20Transfer([GNO], [gpRewardsGno], "GNO_GP-REWARDS"),

  // Transfer XDAI between Gnosis DAO Safes
  allowEthTransfer(gnosisDaoIaGno),
  allowEthTransfer(gnosisDaoLmGno),
  allowEthTransfer(gnosisDaoLpGno),

  // Transfer XDAI to DAO Funded Wallet gLTD
  allowEthTransfer(dfwLtdGno),

  // Transfer [EURe, GNO, sDAI, USDC.e, WETH, wstETH, WXDAI] between Gnosis DAO Safes
  allowErc20Transfer(
    [EURe, GNO, sDAI, USDCe, WETH, wstETH, WXDAI],
    [gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno]
  ),

  // Transfer BRLA to BRLA Receiver (Avenia)
  allowErc20Transfer([BRLA], [aveniaGno]),
] satisfies PermissionList
