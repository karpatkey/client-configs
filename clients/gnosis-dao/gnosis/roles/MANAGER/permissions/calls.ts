import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COW,
  EURCe,
  EURe,
  GNO,
  OLAS,
  SAFE,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WBTC,
  WETH,
  wstETH,
  WXDAI,
  x3CRV,
  curve,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { PermissionList } from "@/types"
import { gnosisDaoEth, gpRewards } from "../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  // Azuro - XDAI LP
  ...allowErc20Approve([WXDAI], [contracts.gnosis.azuro.lpAzrXdai]),
  allow.gnosis.azuro.lpAzrXdai.addLiquidity(),
  allow.gnosis.azuro.lpAzrXdai.withdrawLiquidity(),

  // Balancer v2 - BCoW AMM WETH/GNO (Staking not available)
  ...allowErc20Approve(
    [GNO, WETH],
    [contracts.gnosis.balancerV2.bCowAmm50Weth50Gno]
  ),
  allow.gnosis.balancerV2.bCowAmm50Weth50Gno.joinPool(),
  allow.gnosis.balancerV2.bCowAmm50Weth50Gno.exitPool(),

  // Balancer v2 - BCoW AMM wstETH/sDAI (Staking not available)
  ...allowErc20Approve(
    [sDAI, wstETH],
    [contracts.gnosis.balancerV2.bCowAmm50wstEth50sDai]
  ),
  allow.gnosis.balancerV2.bCowAmm50wstEth50sDai.joinPool(),
  allow.gnosis.balancerV2.bCowAmm50wstEth50sDai.exitPool(),

  // Balancer v2 - BCoW AMM GNO/OLAS (Staking not available)
  ...allowErc20Approve(
    [GNO, OLAS],
    [contracts.gnosis.balancerV2.bCowAmm50Gno50Olas]
  ),
  allow.gnosis.balancerV2.bCowAmm50Gno50Olas.joinPool(),
  allow.gnosis.balancerV2.bCowAmm50Gno50Olas.exitPool(),

  // Balancer v2 - BCoW AMM GNO/COW (Staking not available)
  ...allowErc20Approve(
    [GNO, COW],
    [contracts.gnosis.balancerV2.bCowAmm50Gno50Cow]
  ),
  allow.gnosis.balancerV2.bCowAmm50Gno50Cow.joinPool(),
  allow.gnosis.balancerV2.bCowAmm50Gno50Cow.exitPool(),

  // Balancer v2 - ECLP-bCSPX-sDAI Gauge
  ...allowErc20Approve([GNO], [contracts.gnosis.balancerV2.eclpBcspxSdaiGauge]),
  allow.gnosis.balancerV2.eclpBcspxSdaiGauge.set_reward_distributor(GNO),

  // Curve - EURe/EURC.e
  ...allowErc20Approve([EURCe, EURe], [contracts.gnosis.curve.eureEurc]),
  allow.gnosis.curve.eureEurc["add_liquidity(uint256[],uint256)"](),
  allow.gnosis.curve.eureEurc["remove_liquidity(uint256,uint256[])"](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  allow.gnosis.curve.eureEurc[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),

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

  // Hyperdrive - wstETH
  ...allowErc20Approve([wstETH], [contracts.gnosis.hyperdrive.wstEthLp]),
  allow.gnosis.hyperdrive.wstEthLp.addLiquidity(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      destination: c.avatar,
    }
  ),
  allow.gnosis.hyperdrive.wstEthLp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),
  // Hyperdrive - WXDAI/sDAI
  ...allowErc20Approve(
    [WXDAI, sDAI],
    [contracts.gnosis.hyperdrive.wxdaiSdaiLp]
  ),
  allow.gnosis.hyperdrive.wxdaiSdaiLp.addLiquidity(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      destination: c.avatar,
    }
  ),
  allow.gnosis.hyperdrive.wxdaiSdaiLp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),

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
  // GNO - Gnosis Bridge
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    gnosisDaoEth
  ),

  // SAFE - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisDaoEth
    ),
    targetAddress: SAFE,
  },

  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    gnosisDaoEth
  ),

  // USDT - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisDaoEth
    ),
    targetAddress: USDT,
  },

  // WBTC - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisDaoEth
    ),
    targetAddress: WBTC,
  },

  // WETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisDaoEth
    ),
    targetAddress: WETH,
  },

  // wstETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      gnosisDaoEth
    ),
    targetAddress: wstETH,
  },

  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.xdaiBridge2.relayTokens(gnosisDaoEth, {
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 500 GNO every 24 hours to gpRewards
  allowErc20Transfer([GNO], [gpRewards], "GNO_GP-REWARDS"),
] satisfies PermissionList
