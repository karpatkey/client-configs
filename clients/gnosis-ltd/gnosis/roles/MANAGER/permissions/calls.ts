import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { contracts } from "@/contracts"
import {
  BRLA,
  COW,
  EURe,
  hDAI,
  SAFE,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
  x3CRV,
  balancerV3,
  curve,
} from "@/addresses/gno"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { gnosisLtdEth } from "../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  // Balancer v3 - sDAI/BRLA
  ...allowErc20Approve([BRLA, sDAI], [contracts.gnosis.uniswap.permit2]),
  allow.gnosis.uniswap.permit2.approve(
    c.or(BRLA, sDAI),
    contracts.gnosis.balancerV3.router
  ),
  allow.gnosis.balancerV3.router.addLiquidityProportional(balancerV3.brlaSdai),
  allow.gnosis.balancerV3.router.addLiquidityUnbalanced(balancerV3.brlaSdai),
  ...allowErc20Approve(
    [balancerV3.brlaSdai],
    [contracts.gnosis.balancerV3.router]
  ),
  allow.gnosis.balancerV3.router.removeLiquidityProportional(
    balancerV3.brlaSdai
  ),
  allow.gnosis.balancerV3.router.removeLiquiditySingleTokenExactIn(
    balancerV3.brlaSdai
  ),

  // CowSwap - vCOW
  allow.gnosis.cowSwap.vCow.swapAll(),

  // Curve - EURe/x3CRV
  ...allowErc20Approve([EURe, x3CRV], [contracts.gnosis.curve.crvEureUsdPool]),
  allow.gnosis.curve.crvEureUsdPool["add_liquidity(uint256[2],uint256)"](),
  allow.gnosis.curve.crvEureUsdPool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEureUsdPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [EURe, USDC, USDT, WXDAI],
    [contracts.gnosis.curve.crvEureUsdZap]
  ),
  allow.gnosis.curve.crvEureUsdZap["add_liquidity(uint256[4],uint256)"](),
  allow.gnosis.curve.crvEureUsdZap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEureUsdZap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [curve.crvEureUsd],
    [contracts.gnosis.curve.crvEureUsdGauge]
  ),
  allow.gnosis.curve.crvEureUsdGauge["deposit(uint256)"](),
  allow.gnosis.curve.crvEureUsdGauge["withdraw(uint256)"](),
  allow.gnosis.curve.crvEureUsdGauge["claim_rewards()"](),

  // HOP - WXDAI/hDAI Pool
  ...allowErc20Approve([hDAI, WXDAI], [contracts.gnosis.hop.daiLiquidityPool]),
  allow.gnosis.hop.daiLiquidityPool.addLiquidity(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidity(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityImbalance(),
  allow.gnosis.hop.daiLiquidityPool.removeLiquidityOneToken(),
  ...allowErc20Approve(
    [contracts.gnosis.hop.lpDai],
    [contracts.gnosis.hop.daiRewards2]
  ),
  allow.gnosis.hop.daiRewards2.stake(),
  allow.gnosis.hop.daiRewards2.withdraw(),
  allow.gnosis.hop.daiRewards2.exit(),
  allow.gnosis.hop.daiRewards2.getReward(),

  /*********************************************
   * Swaps
   *********************************************/
  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // Gnosis -> Mainnet
  // COW - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisLtdEth
    ),
    targetAddress: COW,
  },

  // GNO - Gnosis Bridge
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    gnosisLtdEth
  ),

  // SAFE - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisLtdEth
    ),
    targetAddress: SAFE,
  },

  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    gnosisLtdEth
  ),

  // USDT - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisLtdEth
    ),
    targetAddress: USDT,
  },

  // WETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisLtdEth
    ),
    targetAddress: WETH,
  },

  // wstETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisLtdEth
    ),
    targetAddress: wstETH,
  },

  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.xdaiBridge2.relayTokens(gnosisLtdEth, {
    send: true,
  }),
] satisfies PermissionList
