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
  USDT,
  WBTC,
  WETH,
  wstETH,
  WXDAI,
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
} from "../../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

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
    targetAddress: balancerV3.aaveLidoWethWstEthGauge
  },
  {
    ...allow.gnosis.balancerV2.gauge["withdraw(uint256)"](),
    targetAddress: balancerV3.aaveLidoWethWstEthGauge
  },
  {
    ...allow.gnosis.balancerV2.gauge["claim_rewards()"](),
    targetAddress: balancerV3.aaveLidoWethWstEthGauge
  },
  allow.gnosis.balancerV2.minter.mint(
    balancerV3.aaveLidoWethWstEth
  ),

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

  // Balancer v3 - Aave Lido Boosted USDC.e/GHO
  allowErc20Approve([GHO, USDCe], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(GHO, USDCe),
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

  // Balancer v3 - reCLAMM GNO/USDC.e
  allowErc20Approve([GNO, USDCe], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(GNO, USDCe),
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

  // Transfer [EURe, GNO, sDAI, USDC.e, WETH, wstETH, WXDAI] between Gnosis DAO Safes
  allowErc20Transfer(
    [EURe, GNO, sDAI, USDCe, WETH, wstETH, WXDAI],
    [gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno]
  ),
] satisfies PermissionList
