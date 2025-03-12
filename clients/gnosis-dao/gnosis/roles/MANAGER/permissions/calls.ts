import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COW,
  EURCe,
  EURe,
  GNO,
  OLAS,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WETH,
  wstETH,
  WXDAI,
  x3CRV,
  curve,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
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
    [contracts.gnosis.balancer.bCowAmm50Weth50Gno]
  ),
  allow.gnosis.balancer.bCowAmm50Weth50Gno.joinPool(),
  allow.gnosis.balancer.bCowAmm50Weth50Gno.exitPool(),

  // Balancer v2 - BCoW AMM wstETH/sDAI (Staking not available)
  ...allowErc20Approve(
    [sDAI, wstETH],
    [contracts.gnosis.balancer.bCowAmm50wstEth50sDai]
  ),
  allow.gnosis.balancer.bCowAmm50wstEth50sDai.joinPool(),
  allow.gnosis.balancer.bCowAmm50wstEth50sDai.exitPool(),

  // Balancer v2 - BCoW AMM GNO/OLAS (Staking not available)
  ...allowErc20Approve(
    [GNO, OLAS],
    [contracts.gnosis.balancer.bCowAmm50Gno50Olas]
  ),
  allow.gnosis.balancer.bCowAmm50Gno50Olas.joinPool(),
  allow.gnosis.balancer.bCowAmm50Gno50Olas.exitPool(),

  // Balancer v2 - BCoW AMM GNO/COW (Staking not available)
  ...allowErc20Approve(
    [GNO, COW],
    [contracts.gnosis.balancer.bCowAmm50Gno50Cow]
  ),
  allow.gnosis.balancer.bCowAmm50Gno50Cow.joinPool(),
  allow.gnosis.balancer.bCowAmm50Gno50Cow.exitPool(),

  // Balancer v2 - ECLP-bCSPX-sDAI Gauge
  ...allowErc20Approve([GNO], [contracts.gnosis.balancer.eclpBcspxSdaiGauge]),
  allow.gnosis.balancer.eclpBcspxSdaiGauge.set_reward_distributor(
    GNO,
  ),

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

  // StakeWise v3 - Axol.io
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.axol]),
  allow.gnosis.stakeWiseV3.axol.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.axol.updateState(),
  allow.gnosis.stakeWiseV3.axol.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.axol.burnOsToken(),
  allow.gnosis.stakeWiseV3.axol.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.axol.claimExitedAssets(),

  // StakeWise v3 - Stakecat
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.stakecat]),
  allow.gnosis.stakeWiseV3.stakecat.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.updateState(),
  allow.gnosis.stakeWiseV3.stakecat.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakecat.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.claimExitedAssets(),

  // StakeWise v3 - Stakesaurus
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.stakesaurus]),
  allow.gnosis.stakeWiseV3.stakesaurus.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.updateState(),
  allow.gnosis.stakeWiseV3.stakesaurus.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakesaurus.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.serenita]),
  allow.gnosis.stakeWiseV3.serenita.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.updateState(),
  allow.gnosis.stakeWiseV3.serenita.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.serenita.burnOsToken(),
  allow.gnosis.stakeWiseV3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.claimExitedAssets(),

  // StakeWise v3 - Genesis
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.genesis]),
  allow.gnosis.stakeWiseV3.genesis.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.updateState(),
  allow.gnosis.stakeWiseV3.genesis.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.genesis.burnOsToken(),
  allow.gnosis.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.nedo]),
  allow.gnosis.stakeWiseV3.nedo.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.updateState(),
  allow.gnosis.stakeWiseV3.nedo.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.nedo.burnOsToken(),
  allow.gnosis.stakeWiseV3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.claimExitedAssets(),
] satisfies PermissionList
