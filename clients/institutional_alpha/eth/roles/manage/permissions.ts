import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  ZERO_ADDRESS,
  AAVE,
  AURA,
  BAL,
  COMP,
  CRV,
  crvUSD,
  CVX,
  DAI,
  GHO,
  GYD,
  NOTE,
  sDAI,
  sUSDe,
  stkGHO,
  USDC,
  USDe,
  USDM,
  USDT,
  WBTC,
  wM,
  wstETH,
  balancer,
  morpho,
  pendle,
} from "../../../../../eth-sdk/addresses"
import {
  DAI as DAI_opt,
  COMP as COMP_opt,
  USDC as USDC_opt,
} from "../../../../../eth-sdk/addresses_opt"
import { USDC as USDC_arb } from "../../../../../eth-sdk/addresses_arb"
import { USDC as USDC_base } from "../../../../../eth-sdk/addresses_base"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aaveV2.stake({ targets: ["GHO"] }),

  // Aave v3 - Deposit crvUSD
  allowAction.aaveV3.deposit({ targets: ["crvUSD"] }),
  // Aave v3 - Deposit DAI
  allowAction.aaveV3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit sDAI
  allowAction.aaveV3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit sUSDe
  allowAction.aaveV3.deposit({ targets: ["sUSDe"] }),
  // Aave v3 - Deposit USDC
  allowAction.aaveV3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDe
  allowAction.aaveV3.deposit({ targets: ["USDe"] }),
  // Aave v3 - Deposit USDS
  allowAction.aaveV3.deposit({ targets: ["USDS"] }),
  // Aave v3 - Deposit USDT
  allowAction.aaveV3.deposit({ targets: ["USDT"] }),
  // Aave v3 - Borrow DAI
  allowAction.aaveV3.borrow({ targets: ["DAI"] }),
  // Aave v3 - Borrow USDC
  allowAction.aaveV3.borrow({ targets: ["USDC"] }),

  // Aura - GHO/USDC/USDT
  allowAction.aura.deposit({ targets: ["157"] }),

  // Balancer - GHO/USDC/USDT
  allowAction.balancer.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer.stake({ targets: ["GHO/USDT/USDC"] }),

  // Convex - crvUSD/USDT
  allowAction.convex.deposit({ targets: ["179"] }),

  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowSwap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),
  // CowSwap - [DAI, USDC, USDM] <-> [DAI, USDC, USDM]
  allowAction.cowSwap.swap({ sell: [DAI, USDC, USDM], buy: [DAI, USDC, USDM] }),
  // CowSwap - [USDC, wM] <-> [USDC, wM]
  allowAction.cowSwap.swap({ sell: [USDC, wM], buy: [USDC, wM] }),
  // CowSwap - [AAVE, AURA, BAL, CRV, crvUSD, CVX, DAI, GHO, GYD, NOTE, sDAI, stkGHO, sUSDe, USDC, USDe, USDT]
  allowAction.cowSwap.swap({
    sell: [
      AAVE,
      AURA,
      BAL,
      CRV,
      crvUSD,
      CVX,
      DAI,
      GHO,
      GYD,
      NOTE,
      sDAI,
      stkGHO,
      sUSDe,
      USDC,
      USDe,
      USDT,
    ],
    buy: [
      AAVE,
      AURA,
      BAL,
      CRV,
      crvUSD,
      CVX,
      DAI,
      GHO,
      GYD,
      NOTE,
      sDAI,
      stkGHO,
      sUSDe,
      USDC,
      USDe,
      USDT,
    ],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - Borrow DAI
  allowAction.spark.borrow({ targets: ["DAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Curve - crvUSD/USDT
  ...allowErc20Approve(
    [crvUSD, USDT],
    [contracts.mainnet.curve.crvUSDUSDT_f_pool]
  ),
  allow.mainnet.curve.crvUSDUSDT_f_pool["add_liquidity(uint256[2],uint256)"](),
  allow.mainnet.curve.crvUSDUSDT_f_pool[
    "remove_liquidity(uint256,uint256[2])"
  ](),
  allow.mainnet.curve.crvUSDUSDT_f_pool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.crvUSDUSDT_f_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvUSDUSDT_f_pool],
    [contracts.mainnet.curve.crvUSDUSDT_f_gauge]
  ),
  allow.mainnet.curve.crvUSDUSDT_f_gauge["deposit(uint256)"](),
  allow.mainnet.curve.crvUSDUSDT_f_gauge["withdraw(uint256)"](),
  allow.mainnet.curve.crvUSDUSDT_f_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(
    contracts.mainnet.curve.crvUSDUSDT_f_gauge
  ),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [crvUSD, USDT],
    [contracts.mainnet.curve.stake_deposit_zap]
  ),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.crvUSDUSDT_f_pool,
    contracts.mainnet.curve.crvUSDUSDT_f_pool,
    contracts.mainnet.curve.crvUSDUSDT_f_gauge,
    2,
    [USDT, crvUSD],
    undefined,
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS
  ),

  // Ethena - Stake USDe
  ...allowErc20Approve([USDe], [sUSDe]),
  allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
  // Ethena - Unstake USDe
  allow.mainnet.ethena.sUsde.cooldownShares(),
  allow.mainnet.ethena.sUsde.unstake(c.avatar),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  ...allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
  allow.mainnet.maker.dsr_manager.join(c.avatar),
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Morpho Blue - wstETH/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morpho_blue]),
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - WBTC/USDC
  // USDC approval already included
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - WBTC/USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.morpho.morpho_blue]),
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDT,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDT,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

  // Notional v3 - USDC
  ...allowErc20Approve([USDT], [contracts.mainnet.notional_v3.nProxy]),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 4, // DepositUnderlyingAndMintNToken
      currencyId: 3, // USDC
    })
  ),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 5, // RedeemNToken
      currencyId: 3, // USDC
    })
  ),
  // Notional v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.notional_v3.nProxy]),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 4, // DepositUnderlyingAndMintNToken
      currencyId: 8, // USDT
    })
  ),
  allow.mainnet.notional_v3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 5, // RedeemNToken
      currencyId: 8, // USDT
    })
  ),
  allow.mainnet.notional_v3.nProxy.nTokenClaimIncentives(),

  // Pendle - USDe/sUSDe <-> PT-sUSDE-DDMMMYYYY
  ...allowErc20Approve([USDe, sUSDe], [contracts.mainnet.pendle.routerV4]),
  allow.mainnet.pendle.routerV4.swapExactTokenForPt(
    c.avatar,
    c.or(
      pendle.pendleMarket25Dec2024,
      pendle.pendleMarket26Mar2025,
      pendle.pendleMarket28May2025
    ),
    undefined,
    undefined,
    {
      tokenIn: c.or(USDe, sUSDe),
      tokenMintSy: c.or(USDe, sUSDe),
    }
  ),
  ...allowErc20Approve(
    [pendle.ptSusde26Dec2024, pendle.ptSusde27Mar2025, pendle.ptSusde29May2025],
    [contracts.mainnet.pendle.routerV4]
  ),
  allow.mainnet.pendle.routerV4.swapExactPtForToken(
    c.avatar,
    c.or(
      pendle.pendleMarket25Dec2024,
      pendle.pendleMarket26Mar2025,
      pendle.pendleMarket28May2025
    ),
    undefined,
    {
      tokenOut: c.or(USDe, sUSDe),
      tokenRedeemSy: c.or(USDe, sUSDe),
    }
  ),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - Swap GYD <-> sDAI
  balancer__swap(balancer.ECLP_GYD_sDAI_2_pId, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - Swap [GHO, USDC, USDT] <-> [GHO, USDC, USDT]
  balancer__swap(
    balancer.GHO_USDT_USDC_pId,
    [GHO, USDC, USDT],
    [GHO, USDC, USDT]
  ),

  // Curve - 3pool - Swap [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool.exchange(),

  // Curve - Swap sDAI <-> USDM
  allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sdai_usdm_pool]),
  allow.mainnet.curve.sdai_usdm_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Curve - Swap USDe <-> USDC
  allowErc20Approve([USDe, USDC], [contracts.mainnet.curve.USDeUSDC_pool]),
  allow.mainnet.curve.USDeUSDC_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Curve - Swap DAI <-> USDe
  allowErc20Approve([DAI, USDe], [contracts.mainnet.curve.USDeDAI_pool]),
  allow.mainnet.curve.USDeDAI_pool["exchange(int128,int128,uint256,uint256)"](),

  // Curve - Swap sDAI <-> sUSDe
  allowErc20Approve([sDAI, sUSDe], [contracts.mainnet.curve.MtEthena_pool]),
  allow.mainnet.curve.MtEthena_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Curve - Swap crvUSD <-> USDC
  allowErc20Approve(
    [crvUSD, USDC],
    [contracts.mainnet.curve.crvUSDUSDC_f_pool]
  ),
  allow.mainnet.curve.crvUSDUSDC_f_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Curve - Swap crvUSD <-> USDT
  allowErc20Approve(
    [crvUSD, USDT],
    [contracts.mainnet.curve.crvUSDUSDT_f_pool]
  ),
  allow.mainnet.curve.crvUSDUSDT_f_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Uniswap v3 - [USDC, wM] <-> [USDC, wM]
  allowErc20Approve([USDC, wM], [contracts.mainnet.uniswap_v3.router_2]),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(USDC, wM),
    tokenOut: c.or(USDC, wM),
    fee: 100,
    recipient: c.avatar,
  }),

  /*********************************************
   * Bridge
   *********************************************/
  // Mainnet -> Gnosis
  // DAI -> XDAI
  ...allowErc20Approve([DAI], [contracts.mainnet.gno_xdai_bridge]),
  allow.mainnet.gno_xdai_bridge.relayTokens(c.avatar, undefined),
  // Claim bridged XDAI from Gnosis
  allow.mainnet.gno_xdai_bridge.executeSignatures(
    c.and(
      // Avatar address
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes corresponding to the amount
      // skip 32 bytes corresponding to the txHash from Gnosis
      // Recipient address: Gnosis Chain xDai Bridge
      c.bitmask({
        shift: 20 + 32 + 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gno_xdai_bridge.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gno_xdai_bridge.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // DAI (Mainnet) -> DAI (Gnosis) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    100, // Gnosis
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // // COMP (Mainnet) -> COMP (Gnosis)
  // ...allowErc20Approve([COMP], [contracts.mainnet.gno_omnibridge]),
  // allow.mainnet.gno_omnibridge["relayTokens(address,address,uint256)"](
  //   COMP,
  //   c.avatar
  // ),
  // // Claim bridged COMP from Gnosis
  // allow.mainnet.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
  //   c.and(
  //     // messageId: 32 bytes
  //     // First 4 bytes
  //     c.bitmask({
  //       shift: 0,
  //       mask: "0xffffffff",
  //       value: "0x00050000",
  //     }),
  //     // Next 10 bytes
  //     c.bitmask({
  //       shift: 4,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0xa7823d6f1e31569f5186",
  //     }),
  //     // Next 10 bytes
  //     c.bitmask({
  //       shift: 4 + 10,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0x1e345b30c6bebf70ebe7",
  //     }),
  //     // skip last 8 bytes (nonce)
  //     // sender: 20 bytes
  //     c.bitmask({
  //       shift: 32,
  //       mask: "0xffffffffffffffffffff",
  //       value: contracts.gnosis.xdai_bridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
  //     }),
  //     c.bitmask({
  //       shift: 32 + 10,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0x" + contracts.gnosis.xdai_bridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
  //     }),
  //     // executor: 20 bytes
  //     c.bitmask({
  //       shift: 32 + 20,
  //       mask: "0xffffffffffffffffffff",
  //       value: contracts.mainnet.gno_omnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
  //     }),
  //     c.bitmask({
  //       shift: 32 + 20 + 10,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0x" + contracts.mainnet.gno_omnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
  //     }),
  //     // gasLimit: 4 bytes
  //     c.bitmask({
  //       shift: 32 + 20 + 20,
  //       mask: "0xffffffff",
  //       value: "0x000927c0",
  //     }),
  //     // dataType + chainIds: 5 bytes
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4,
  //       mask: "0xffffffffff",
  //       value: "0x0101806401",
  //     }),
  //     // selector (handleNativeTokens): 4 bytes
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4 + 5,
  //       mask: "0xffffffff",
  //       value: "0x272255bb",
  //     }),
  //     // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
  //     // Token address
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
  //       mask: "0xffffffffffffffffffff",
  //       value: COMP.slice(0, 22), // First 10 bytes of the token address
  //     }),
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0x" + COMP.slice(22, 42), // Last 10 bytes of the token address
  //     }),
  //     // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
  //     // Avatar address
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
  //       mask: "0xffffffffffffffffffff",
  //       value: avatar.slice(0, 22), // First 10 bytes of the avatar address
  //     }),
  //     c.bitmask({
  //       shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
  //       mask: "0xffffffffffffffffffff",
  //       value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
  //     })
  //   )
  // ),

  // USDC (Mainnet) -> USDC.e (Gnosis)
  ...allowErc20Approve([USDC], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge.relayTokensAndCall(
    USDC,
    contracts.gnosis.usdc_transmuter,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0")
  ),
  // Claim bridged USDC from Gnosis
  allow.mainnet.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
    c.and(
      // messageId: 32 bytes
      // First 4 bytes
      c.bitmask({
        shift: 0,
        mask: "0xffffffff",
        value: "0x00050000",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4,
        mask: "0xffffffffffffffffffff",
        value: "0xa7823d6f1e31569f5186",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x1e345b30c6bebf70ebe7",
      }),
      // skip last 8 bytes (nonce)
      // sender: 20 bytes
      c.bitmask({
        shift: 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.gnosis.xdai_bridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdai_bridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gno_omnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gno_omnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
      }),
      // gasLimit: 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20,
        mask: "0xffffffff",
        value: "0x000927c0",
      }),
      // dataType + chainIds: 5 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4,
        mask: "0xffffffffff",
        value: "0x0101806401",
      }),
      // selector (handleNativeTokens): 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5,
        mask: "0xffffffff",
        value: "0x272255bb",
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Token address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC.slice(22, 42), // Last 10 bytes of the token address
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // HOP does not work with USDC and USDC.e

  // Mainnet -> Optimism
  // DAI (Mainnet) -> DAI (Optimism)
  ...allowErc20Approve([DAI], [contracts.mainnet.opt_dai_bridge]),
  allow.mainnet.opt_dai_bridge.depositERC20(DAI, DAI_opt),
  allow.mainnet.opt_dai_bridge.depositERC20To(DAI, DAI_opt, c.avatar),
  // DAI (Mainnet) -> DAI (Optimism) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    10, // Optimism
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // COMP (Mainnet) -> COMP (Optimism)
  ...allowErc20Approve([COMP], [contracts.mainnet.opt_gateway]),
  allow.mainnet.opt_gateway.depositERC20(COMP, COMP_opt),
  allow.mainnet.opt_gateway.depositERC20To(COMP, COMP_opt, c.avatar),

  // USDC (Mainnet) -> USDC (Optimism)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    2,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Optimism
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000002)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000200000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Optimism)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.optimism.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.optimism.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_opt.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_opt.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Optimism) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    10, // Optimism
    c.avatar
  ),

  // Mainnet -> Arbitrum
  // DAI (Mainnet) -> DAI (Arbitrum)
  ...allowErc20Approve([DAI], [contracts.mainnet.arb_dai_gateway]),
  allow.mainnet.arb_dai_gateway.outboundTransfer(DAI, c.avatar),
  // DAI (Mainnet) -> DAI (Arbitrum) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    42161, // Arbitrum
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // COMP (Mainnet) -> COMP (Arbitrum)
  ...allowErc20Approve([COMP], [contracts.mainnet.arb_erc20_gateway]),
  allow.mainnet.arb_erc20_gateway.outboundTransfer(COMP, c.avatar),

  // USDC (Mainnet) -> USDC (Arbitrum)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    3,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Arbitrum
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000003)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000300000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Arbitrum)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.arbitrumOne.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value:
          "0x" + contracts.arbitrumOne.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_arb.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_arb.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Arbitrum) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    42161, // Arbitrum
    c.avatar
  ),

  // Mainnet -> Base
  // USDC (Mainnet) -> USDC (Base)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    6,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Base
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000006)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000600000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Base)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.base.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.base.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_base.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_base.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Base) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    8453, // Base
    c.avatar
  ),
] satisfies PermissionList
