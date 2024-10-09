import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
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
  ZERO_ADDRESS,
  curve,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit EURe
  allowAction.aave_v3.deposit({ targets: ["EURe"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),

  // Aura - WETH/wstETH
  allowAction.aura.deposit({ targets: ["0"] }),
  // Aura - EURe/sDAI
  allowAction.aura.deposit({ targets: ["18"] }),
  // Aura - Gyroscope ECLP rETH/WETH
  allowAction.aura.deposit({ targets: ["26"] }),

  // Balancer - wstETH/GNO
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50GNO"] }),
  // Balancer - sDAI/wstETH
  allowAction.balancer.deposit({ targets: ["B-50sDAI-50wstETH"] }),
  allowAction.balancer.stake({ targets: ["B-50sDAI-50wstETH"] }),
  // Balancer - USDC.e/USDT/sDAI
  allowAction.balancer.deposit({ targets: ["sBAL3"] }),
  allowAction.balancer.stake({ targets: ["sBAL3"] }),
  // Balancer - WETH/wstETH
  allowAction.balancer.deposit({ targets: ["bb-WETH-wstETH"] }),
  allowAction.balancer.stake({ targets: ["bb-WETH-wstETH"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-rETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-rETH-WETH"] }),
  // Balancer - osGNO/GNO
  allowAction.balancer.deposit({ targets: ["osGNO/GNO-BPT"] }),
  allowAction.balancer.stake({ targets: ["osGNO/GNO-BPT"] }),
  // Balancer - WBTC/WETH
  allowAction.balancer.deposit({ targets: ["50WBTC-50WETH"] }),
  allowAction.balancer.stake({ targets: ["50WBTC-50WETH"] }),
  // Balancer - Gyroscope ECLP wstETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-wstETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-wstETH-WETH"] }),
  // Balancer - wstETH/BAL/AURA
  allowAction.balancer.deposit({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  // Balancer - wstETH/COW
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50COW"] }),
  // Balancer - COW/GNO
  allowAction.balancer.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50COW-50GNO"] }),
  // Balancer - stEUR/EURe
  allowAction.balancer.deposit({ targets: ["stEUR/EURe"] }),
  allowAction.balancer.stake({ targets: ["stEUR/EURe"] }),
  // Balancer - GIV/GNO
  allowAction.balancer.deposit({ targets: ["50GIV-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50GIV-50GNO"] }),
  // Balancer - WXDAI/GNO
  allowAction.balancer.deposit({ targets: ["WXDAI-GNO"] }),
  allowAction.balancer.stake({ targets: ["WXDAI-GNO"] }),

  // CowSwap - XDAI -> EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: ["XDAI"],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - XDAI <- EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: ["XDAI"],
  }),

  // CowSwap - WXDAI -> EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [EURe, USDCe, USDT],
  }),
  // CowSwap - WXDAI <- EURe/USDC.e/USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDCe, USDT],
    buy: [WXDAI],
  }),

  // CowSwap - USDC.e <-> USDT
  allowAction.cowswap.swap({
    sell: [USDCe, USDT],
    buy: [USDCe, USDT],
  }),

  // CowSwap - USDC <-> USDC.e
  allowAction.cowswap.swap({
    sell: [USDC, USDCe],
    buy: [USDC, USDCe],
  }),

  // CowSwap - EURe <-> USDC.e
  allowAction.cowswap.swap({
    sell: [EURe, USDCe],
    buy: [EURe, USDCe],
  }),

  // CowSwap - EURe <-> USDT
  allowAction.cowswap.swap({
    sell: [EURe, USDT],
    buy: [EURe, USDT],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  // Arrakis - WETH/sDAI
  ...allowErc20Approve([WETH, sDAI], [contracts.gnosis.arrakis.permit2]),
  allow.gnosis.arrakis.sign_message_lib.signMessage(undefined, {
    delegatecall: true,
  }),
  allow.gnosis.arrakis.router.addLiquidityPermit2({
    addData: {
      vault: contracts.gnosis.arrakis.WETH_sDAI_vault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: c.every({
        token: c.or(WETH, sDAI),
      }),
    },
  }),
  ...allowErc20Approve(
    [contracts.gnosis.arrakis.WETH_sDAI_vault],
    [contracts.gnosis.arrakis.permit2]
  ),
  // signMessage() already included
  allow.gnosis.arrakis.router.removeLiquidityPermit2({
    removeData: {
      vault: contracts.gnosis.arrakis.WETH_sDAI_vault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: {
        token: contracts.gnosis.arrakis.WETH_sDAI_vault,
      },
    },
  }),

  // Arrakis - WETH/wstETH
  ...allowErc20Approve([WETH, wstETH], [contracts.gnosis.arrakis.permit2]),
  allow.gnosis.arrakis.sign_message_lib.signMessage(undefined, {
    delegatecall: true,
  }),
  allow.gnosis.arrakis.router.addLiquidityPermit2({
    addData: {
      vault: contracts.gnosis.arrakis.WETH_wstETH_vault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: c.every({
        token: c.or(WETH, wstETH),
      }),
    },
  }),
  ...allowErc20Approve(
    [contracts.gnosis.arrakis.WETH_wstETH_vault],
    [contracts.gnosis.arrakis.permit2]
  ),
  // signMessage() already included
  allow.gnosis.arrakis.router.removeLiquidityPermit2({
    removeData: {
      vault: contracts.gnosis.arrakis.WETH_wstETH_vault,
      receiver: c.avatar,
      gauge: ZERO_ADDRESS,
    },
    permit: {
      permitted: {
        token: contracts.gnosis.arrakis.WETH_wstETH_vault,
      },
    },
  }),

  // Azuro - XDAI LP
  ...allowErc20Approve([WXDAI], [contracts.gnosis.azuro.LP_AZR_XDAI]),
  allow.gnosis.azuro.LP_AZR_XDAI.addLiquidity(),
  allow.gnosis.azuro.LP_AZR_XDAI.withdrawLiquidity(),

  // Balancer - BCoW AMM WETH/GNO (Staking not available)
  ...allowErc20Approve(
    [GNO, WETH],
    [contracts.gnosis.balancer.BCoW_AMM_50WETH_50GNO]
  ),
  allow.gnosis.balancer.BCoW_AMM_50WETH_50GNO.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50WETH_50GNO.exitPool(),

  // Balancer - BCoW AMM wstETH/sDAI (Staking not available)
  ...allowErc20Approve(
    [sDAI, wstETH],
    [contracts.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI]
  ),
  allow.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI.exitPool(),

  // Balancer - BCoW AMM GNO/OLAS (Staking not available)
  ...allowErc20Approve(
    [GNO, OLAS],
    [contracts.gnosis.balancer.BCoW_AMM_50GNO_50OLAS]
  ),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50OLAS.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50OLAS.exitPool(),

  // Balancer - BCoW AMM GNO/COW (Staking not available)
  ...allowErc20Approve(
    [GNO, COW],
    [contracts.gnosis.balancer.BCoW_AMM_50GNO_50COW]
  ),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50COW.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50COW.exitPool(),

  // Curve - EURe/EURC.e
  ...allowErc20Approve([EURCe, EURe], [contracts.gnosis.curve.EUReEURC]),
  allow.gnosis.curve.EUReEURC["add_liquidity(uint256[],uint256)"](),
  allow.gnosis.curve.EUReEURC["remove_liquidity(uint256,uint256[])"](),
  allow.gnosis.curve.EUReEURC[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  allow.gnosis.curve.EUReEURC[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),

  // Curve - EURe/x3CRV
  ...allowErc20Approve([EURe, x3CRV], [contracts.gnosis.curve.crvEUReUSD_pool]),
  allow.gnosis.curve.crvEUReUSD_pool["add_liquidity(uint256[2],uint256)"](),
  allow.gnosis.curve.crvEUReUSD_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.gnosis.curve.crvEUReUSD_pool[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [EURe, USDC, USDT, WXDAI],
    [contracts.gnosis.curve.crvEUReUSD_zap]
  ),
  allow.gnosis.curve.crvEUReUSD_zap["add_liquidity(uint256[4],uint256)"](),
  allow.gnosis.curve.crvEUReUSD_zap["remove_liquidity(uint256,uint256[4])"](),
  allow.gnosis.curve.crvEUReUSD_zap[
    "remove_liquidity_one_coin(uint256,uint256,uint256)"
  ](),
  ...allowErc20Approve(
    [curve.crvEUReUSD],
    [contracts.gnosis.curve.crvEUReUSD_gauge]
  ),
  allow.gnosis.curve.crvEUReUSD_gauge["deposit(uint256)"](),
  allow.gnosis.curve.crvEUReUSD_gauge["withdraw(uint256)"](),
  allow.gnosis.curve.crvEUReUSD_gauge["claim_rewards()"](),

  // Hyperdrive - wstETH
  ...allowErc20Approve([wstETH], [contracts.gnosis.hyperdrive.wstETH_lp]),
  allow.gnosis.hyperdrive.wstETH_lp.addLiquidity(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      destination: c.avatar,
    }
  ),
  allow.gnosis.hyperdrive.wstETH_lp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),
  // Hyperdrive - WXDAI/sDAI
  ...allowErc20Approve(
    [WXDAI, sDAI],
    [contracts.gnosis.hyperdrive.WXDAI_sDAI_lp]
  ),
  allow.gnosis.hyperdrive.WXDAI_sDAI_lp.addLiquidity(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      destination: c.avatar,
    }
  ),
  allow.gnosis.hyperdrive.WXDAI_sDAI_lp.removeLiquidity(undefined, undefined, {
    destination: c.avatar,
  }),

  // StakeWise v3 - Axol.io
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.axol]),
  allow.gnosis.stakewise_v3.axol.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.axol.updateState(),
  allow.gnosis.stakewise_v3.axol.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.axol.burnOsToken(),
  allow.gnosis.stakewise_v3.axol.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.axol.claimExitedAssets(),

  // StakeWise v3 - Stakecat
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.stakecat]),
  allow.gnosis.stakewise_v3.stakecat.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakecat.updateState(),
  allow.gnosis.stakewise_v3.stakecat.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.stakecat.burnOsToken(),
  allow.gnosis.stakewise_v3.stakecat.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakecat.claimExitedAssets(),

  // StakeWise v3 - Stakesaurus
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.stakesaurus]),
  allow.gnosis.stakewise_v3.stakesaurus.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakesaurus.updateState(),
  allow.gnosis.stakewise_v3.stakesaurus.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.stakesaurus.burnOsToken(),
  allow.gnosis.stakewise_v3.stakesaurus.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.stakesaurus.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.serenita]),
  allow.gnosis.stakewise_v3.serenita.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.updateState(),
  allow.gnosis.stakewise_v3.serenita.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.serenita.burnOsToken(),
  allow.gnosis.stakewise_v3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.serenita.claimExitedAssets(),

  // StakeWise v3 - Genesis
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.genesis]),
  allow.gnosis.stakewise_v3.genesis.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.updateState(),
  allow.gnosis.stakewise_v3.genesis.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.genesis.burnOsToken(),
  allow.gnosis.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.genesis.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allowErc20Approve([GNO], [contracts.gnosis.stakewise_v3.nedo]),
  allow.gnosis.stakewise_v3.nedo.deposit(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.updateState(),
  allow.gnosis.stakewise_v3.nedo.mintOsToken(c.avatar),
  allow.gnosis.stakewise_v3.nedo.burnOsToken(),
  allow.gnosis.stakewise_v3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakewise_v3.nedo.claimExitedAssets(),
] satisfies PermissionList
