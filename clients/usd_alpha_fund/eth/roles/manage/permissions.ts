import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  zeroAddress,
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
import { allowErc20Approve } from "../../../../../helpers/erc20"
import { PermissionList } from "../../../../../types"
import { balancerSwap } from "../../../../../helpers/exit_strategies/balancer"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  // Aave v3 Core Market - Deposit crvUSD
  allowAction.aave_v3.deposit({ market: "Core", targets: ["crvUSD"] }),
  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit sDAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
  // Aave v3 Core Market - Deposit sUSDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["sUSDe"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit USDe
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDe"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Borrow DAI
  allowAction.aave_v3.borrow({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Borrow USDC
  allowAction.aave_v3.borrow({ market: "Core", targets: ["USDC"] }),

  // Aura - GHO/USDC/USDT
  allowAction.aura.deposit({ targets: ["157"] }),

  // Balancer - GHO/USDC/USDT
  allowAction.balancer.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer.stake({ targets: ["GHO/USDT/USDC"] }),

  // Convex - crvUSD/USDT
  allowAction.convex.deposit({ targets: ["179"] }),

  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),
  // CowSwap - [DAI, USDC, USDM] <-> [DAI, USDC, USDM]
  allowAction.cowswap.swap({ sell: [DAI, USDC, USDM], buy: [DAI, USDC, USDM] }),
  // CowSwap - [USDC, wM] <-> [USDC, wM]
  allowAction.cowswap.swap({ sell: [USDC, wM], buy: [USDC, wM] }),
  // CowSwap - [AAVE, AURA, BAL, CRV, crvUSD, CVX, DAI, GHO, GYD, NOTE, sDAI, stkGHO, sUSDe, USDC, USDe, USDT] <->
  // [AAVE, AURA, BAL, CRV, crvUSD, CVX, DAI, GHO, GYD, NOTE, sDAI, stkGHO, sUSDe, USDC, USDe, USDT]
  allowAction.cowswap.swap({
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
  // Compound v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

  // Curve - crvUSD/USDT
  ...allowErc20Approve(
    [crvUSD, USDT],
    [contracts.mainnet.curve.crvUsdUsdtPool]
  ),
  allow.mainnet.curve.crvUsdUsdtPool["add_liquidity(uint256[2],uint256)"](),
  allow.mainnet.curve.crvUsdUsdtPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.crvUsdUsdtPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.crvUsdUsdtPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvUsdUsdtPool],
    [contracts.mainnet.curve.crvUsdUsdtGauge]
  ),
  allow.mainnet.curve.crvUsdUsdtGauge["deposit(uint256)"](),
  allow.mainnet.curve.crvUsdUsdtGauge["withdraw(uint256)"](),
  allow.mainnet.curve.crvUsdUsdtGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.crvUsdUsdtGauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [crvUSD, USDT],
    [contracts.mainnet.curve.stakeDepositZap]
  ),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.crvUsdUsdtPool,
    contracts.mainnet.curve.crvUsdUsdtPool,
    contracts.mainnet.curve.crvUsdUsdtGauge,
    2,
    [USDT, crvUSD],
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress
  ),

  // Ethena - Stake USDe
  ...allowErc20Approve([USDe], [sUSDe]),
  allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
  // Ethena - Unstake USDe
  allow.mainnet.ethena.sUsde.cooldownShares(),
  allow.mainnet.ethena.sUsde.unstake(c.avatar),

  // Morpho Blue - wstETH/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
  allow.mainnet.morpho.morphoBlue.supply(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.oracleWstEthUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.oracleWstEthUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - WBTC/USDC
  // USDC approval already included
  allow.mainnet.morpho.morphoBlue.supply(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdc,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - WBTC/USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.morpho.morphoBlue]),
  allow.mainnet.morpho.morphoBlue.supply(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdt,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdt,
      irm: morpho.adaptativeCurveIrm,
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),

  // Notional v3 - USDC
  ...allowErc20Approve([USDT], [contracts.mainnet.notionalV3.nProxy]),
  allow.mainnet.notionalV3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 4, // DepositUnderlyingAndMintNToken
      currencyId: 3, // USDC
    })
  ),
  allow.mainnet.notionalV3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 5, // RedeemNToken
      currencyId: 3, // USDC
    })
  ),
  // Notional v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.notionalV3.nProxy]),
  allow.mainnet.notionalV3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 4, // DepositUnderlyingAndMintNToken
      currencyId: 8, // USDT
    })
  ),
  allow.mainnet.notionalV3.nProxy.batchBalanceAction(
    c.avatar,
    c.every({
      actionType: 5, // RedeemNToken
      currencyId: 8, // USDT
    })
  ),
  allow.mainnet.notionalV3.nProxy.nTokenClaimIncentives(),

  // Pendle - USDe/sUSDe <-> PT-sUSDE-DDMMMYYYY
  ...allowErc20Approve([USDe, sUSDe], [contracts.mainnet.pendle.routerV4]),
  allow.mainnet.pendle.routerV4.swapExactTokenForPt(
    c.avatar,
    c.or(pendle.pendleMarket26Mar2025, pendle.pendleMarket28May2025),
    undefined,
    undefined,
    {
      tokenIn: c.or(USDe, sUSDe),
      tokenMintSy: c.or(USDe, sUSDe),
    }
  ),
  ...allowErc20Approve(
    [pendle.ptSusde27Mar2025, pendle.ptSusde29May2025],
    [contracts.mainnet.pendle.routerV4]
  ),
  allow.mainnet.pendle.routerV4.swapExactPtForToken(
    c.avatar,
    c.or(pendle.pendleMarket26Mar2025, pendle.pendleMarket28May2025),
    undefined,
    {
      tokenOut: c.or(USDe, sUSDe),
      tokenRedeemSy: c.or(USDe, sUSDe),
    }
  ),

  // Sky - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  ...allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
  allow.mainnet.sky.dsrManager.join(c.avatar),
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - GYD <-> sDAI
  balancerSwap(balancer.eclpGydSdai2Pid, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - [GHO, USDC, USDT] <-> [GHO, USDC, USDT]
  balancerSwap(balancer.ghoUsdtUsdcPid, [GHO, USDC, USDT], [GHO, USDC, USDT]),

  // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.exchange(),

  // Curve - sDAI <-> USDM
  allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sDaiUsdmPool]),
  allow.mainnet.curve.sDaiUsdmPool["exchange(int128,int128,uint256,uint256)"](),

  // Curve - USDe <-> USDC
  allowErc20Approve([USDe, USDC], [contracts.mainnet.curve.usdeUsdcPool]),
  allow.mainnet.curve.usdeUsdcPool["exchange(int128,int128,uint256,uint256)"](),

  // Curve - DAI <-> USDe
  allowErc20Approve([DAI, USDe], [contracts.mainnet.curve.usdeDaiPool]),
  allow.mainnet.curve.usdeDaiPool["exchange(int128,int128,uint256,uint256)"](),

  // Curve - sDAI <-> sUSDe
  allowErc20Approve([sDAI, sUSDe], [contracts.mainnet.curve.mtEthenaPool]),
  allow.mainnet.curve.mtEthenaPool["exchange(int128,int128,uint256,uint256)"](),

  // Curve - crvUSD <-> USDC
  allowErc20Approve([crvUSD, USDC], [contracts.mainnet.curve.crvUsdUsdcPool]),
  allow.mainnet.curve.crvUsdUsdcPool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Curve - crvUSD <-> USDT
  allowErc20Approve([crvUSD, USDT], [contracts.mainnet.curve.crvUsdUsdtPool]),
  allow.mainnet.curve.crvUsdUsdtPool[
    "exchange(int128,int128,uint256,uint256)"
  ](),

  // Uniswap v3 - [USDC, wM] <-> [USDC, wM]
  allowErc20Approve([USDC, wM], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDC, wM),
    tokenOut: c.or(USDC, wM),
    fee: 100,
    recipient: c.avatar,
  }),

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.mainnet.navCalculator.bridgeStart(),

  // Mainnet -> Gnosis
  // DAI -> XDAI
  ...allowErc20Approve([DAI], [contracts.mainnet.gnoXdaiBridge]),
  allow.mainnet.gnoXdaiBridge.relayTokens(c.avatar, undefined),
  // Claim bridged XDAI from Gnosis
  allow.mainnet.gnoXdaiBridge.executeSignatures(
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
        value: contracts.mainnet.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // DAI (Mainnet) -> DAI (Gnosis) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
  allow.mainnet.hopDaiBridge.sendToL2(
    100, // Gnosis
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // USDC (Mainnet) -> USDC.e (Gnosis)
  ...allowErc20Approve([USDC], [contracts.mainnet.gnoOmnibridge]),
  allow.mainnet.gnoOmnibridge.relayTokensAndCall(
    USDC,
    contracts.gnosis.usdcTransmuter,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0")
  ),
  // Claim bridged USDC from Gnosis
  allow.mainnet.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
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
        value: contracts.gnosis.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
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
  ...allowErc20Approve([DAI], [contracts.mainnet.optDaiBridge]),
  allow.mainnet.optDaiBridge.depositERC20(DAI, DAI_opt),
  allow.mainnet.optDaiBridge.depositERC20To(DAI, DAI_opt, c.avatar),
  // DAI (Mainnet) -> DAI (Optimism) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
  allow.mainnet.hopDaiBridge.sendToL2(
    10, // Optimism
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // COMP (Mainnet) -> COMP (Optimism)
  ...allowErc20Approve([COMP], [contracts.mainnet.optGateway]),
  allow.mainnet.optGateway.depositERC20(COMP, COMP_opt),
  allow.mainnet.optGateway.depositERC20To(COMP, COMP_opt, c.avatar),

  // USDC (Mainnet) -> USDC (Optimism)
  ...allowErc20Approve([USDC], [contracts.mainnet.circleTokenMessenger]),
  allow.mainnet.circleTokenMessenger.depositForBurn(
    undefined,
    2,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Optimism
  allow.mainnet.circleMessageTransmitter.receiveMessage(
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
        value: contracts.optimism.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.optimism.circleTokenMessenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circleTokenMessenger.slice(22, 42),
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
  ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
  allow.mainnet.l1HopCctp.send(
    10, // Optimism
    c.avatar
  ),

  // Mainnet -> Arbitrum
  // DAI (Mainnet) -> DAI (Arbitrum)
  ...allowErc20Approve([DAI], [contracts.mainnet.arbDaiGateway]),
  allow.mainnet.arbDaiGateway.outboundTransfer(DAI, c.avatar),
  // DAI (Mainnet) -> DAI (Arbitrum) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hopDaiBridge]),
  allow.mainnet.hopDaiBridge.sendToL2(
    42161, // Arbitrum
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
  ),

  // COMP (Mainnet) -> COMP (Arbitrum)
  ...allowErc20Approve([COMP], [contracts.mainnet.arbErc20Gateway]),
  allow.mainnet.arbErc20Gateway.outboundTransfer(COMP, c.avatar),

  // USDC (Mainnet) -> USDC (Arbitrum)
  ...allowErc20Approve([USDC], [contracts.mainnet.circleTokenMessenger]),
  allow.mainnet.circleTokenMessenger.depositForBurn(
    undefined,
    3,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Arbitrum
  allow.mainnet.circleMessageTransmitter.receiveMessage(
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
        value: contracts.arbitrumOne.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.arbitrumOne.circleTokenMessenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circleTokenMessenger.slice(22, 42),
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
  ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
  allow.mainnet.l1HopCctp.send(
    42161, // Arbitrum
    c.avatar
  ),

  // Mainnet -> Base
  // USDC (Mainnet) -> USDC (Base)
  ...allowErc20Approve([USDC], [contracts.mainnet.circleTokenMessenger]),
  allow.mainnet.circleTokenMessenger.depositForBurn(
    undefined,
    6,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Base
  allow.mainnet.circleMessageTransmitter.receiveMessage(
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
        value: contracts.base.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.base.circleTokenMessenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circleTokenMessenger.slice(22, 42),
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
  ...allowErc20Approve([USDC], [contracts.mainnet.l1HopCctp]),
  allow.mainnet.l1HopCctp.send(
    8453, // Base
    c.avatar
  ),
] satisfies PermissionList
