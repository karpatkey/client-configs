import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COMP,
  crvUSD,
  DAI,
  GHO,
  GYD,
  sDAI,
  sUSDe,
  USDC,
  USDe,
  USDM,
  USDT,
  WBTC,
  wM,
  wstETH,
  aura,
  balancerV2,
  balancerV3,
  morpho,
  pendle,
} from "@/addresses/eth"
import { DAI as DAI_opt, COMP as COMP_opt } from "@/addresses/oeth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import { zeroAddress } from "@/addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aura - Aave Boosted USDT/GHO/USDC
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("246"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },

    // Balancer v3 - Aave Boosted USDT/GHO/USDC
    ...allowErc20Approve(
      [GHO, USDC, USDT],
      [contracts.mainnet.uniswap.permit2]
    ),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC, USDT),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [balancerV3.aaveGhoUsdtUsdcGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },

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
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
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

    // Curve - crvUSD/USDC
    ...allowErc20Approve(
      [crvUSD, USDC],
      [contracts.mainnet.curve.crvUsdUsdcPool]
    ),
    allow.mainnet.curve.crvUsdUsdcPool["add_liquidity(uint256[2],uint256)"](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    ...allowErc20Approve(
      [contracts.mainnet.curve.crvUsdUsdcPool],
      [contracts.mainnet.curve.crvUsdUsdcGauge]
    ),
    allow.mainnet.curve.crvUsdUsdcGauge["deposit(uint256)"](),
    allow.mainnet.curve.crvUsdUsdcGauge["withdraw(uint256)"](),
    allow.mainnet.curve.crvUsdUsdcGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.crvUsdUsdcGauge),

    // Curve - Deposit and Stake using a special ZAP
    ...allowErc20Approve(
      [crvUSD, USDC, USDT],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
    allow.mainnet.curve.stakeDepositZap[
      "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
    ](
      c.or(
        contracts.mainnet.curve.crvUsdUsdtPool,
        contracts.mainnet.curve.crvUsdUsdcPool
      ),
      c.or(
        contracts.mainnet.curve.crvUsdUsdtPool,
        contracts.mainnet.curve.crvUsdUsdcPool
      ),
      c.or(
        contracts.mainnet.curve.crvUsdUsdtGauge,
        contracts.mainnet.curve.crvUsdUsdcGauge
      ),
      2,
      c.or([USDT, crvUSD], [USDC, crvUSD]),
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
        lltv: "860000000000000000",
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
    balancerV2Swap(balancerV2.eclpGydSdai2Pid, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - [GHO, USDC, USDT] <-> [GHO, USDC, USDT]
    balancerV2Swap(
      balancerV2.ghoUsdtUsdcPid,
      [GHO, USDC, USDT],
      [GHO, USDC, USDT]
    ),

    // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
    ...allowErc20Approve(
      [DAI, USDC, USDT],
      [contracts.mainnet.curve.x3CrvPool]
    ),
    allow.mainnet.curve.x3CrvPool.exchange(),

    // Curve - sDAI <-> USDM
    allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sDaiUsdmPool]),
    allow.mainnet.curve.sDaiUsdmPool[
      "exchange(int128,int128,uint256,uint256)"
    ](),

    // Curve - USDe <-> USDC
    allowErc20Approve([USDe, USDC], [contracts.mainnet.curve.usdeUsdcPool]),
    allow.mainnet.curve.usdeUsdcPool[
      "exchange(int128,int128,uint256,uint256)"
    ](),

    // Curve - DAI <-> USDe
    allowErc20Approve([DAI, USDe], [contracts.mainnet.curve.usdeDaiPool]),
    allow.mainnet.curve.usdeDaiPool[
      "exchange(int128,int128,uint256,uint256)"
    ](),

    // Curve - sDAI <-> sUSDe
    allowErc20Approve([sDAI, sUSDe], [contracts.mainnet.curve.mtEthenaPool]),
    allow.mainnet.curve.mtEthenaPool[
      "exchange(int128,int128,uint256,uint256)"
    ](),

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
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    ...allowErc20Approve(
      [DAI],
      [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]
    ),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, c.avatar),
    // Claim bridged XDAI from Gnosis
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.executeSignatures(
      c.and(
        // Avatar address
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes corresponding to the amount
        // skip 32 bytes corresponding to the nonce
        // Recipient address: xDai Bridge
        c.bitmask({
          shift: 20 + 32 + 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the xDai Bridge
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the xDai Bridge
        })
      )
    ),
    // DAI - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      100, // Gnosis
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // USDC -> USDC.e - Gnosis Bridge
    ...allowErc20Approve(
      [USDC],
      [contracts.mainnet.gnosisBridge.gnoOmnibridge]
    ),
    allow.mainnet.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.gnosisBridge.usdcTransmuter,
      undefined,
      "0x" + parameters.avatar.slice(2).padStart(64, "0")
    ),
    // Claim bridged USDC from Gnosis
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
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
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
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
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
    // HOP does not work with USDC and USDC.e

    // Mainnet -> Optimism
    // DAI - Superbridge
    ...allowErc20Approve(
      [DAI],
      [contracts.mainnet.optimismBridge.optDaiBridge]
    ),
    allow.mainnet.optimismBridge.optDaiBridge.depositERC20(
      DAI,
      DAI_opt,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.optimismBridge.optDaiBridge.depositERC20To(
      DAI,
      DAI_opt,
      c.avatar,
      undefined,
      undefined,
      c.or("0x", "0x7375706572627269646765")
    ),
    // DAI - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      10, // Optimism
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP - Superbridge
    ...allowErc20Approve([COMP], [contracts.mainnet.optimismBridge.optGateway]),
    allow.mainnet.optimismBridge.optGateway.depositERC20(
      COMP,
      COMP_opt,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.optimismBridge.optGateway.depositERC20To(
      COMP,
      COMP_opt,
      c.avatar,
      undefined,
      undefined,
      c.or("0x", "0x7375706572627269646765")
    ),

    // USDC - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      10, // Optimism
      c.avatar
    ),

    // Mainnet -> Arbitrum
    // DAI - Arbitrum Bridge
    ...allowErc20Approve(
      [DAI],
      [contracts.mainnet.arbitrumBridge.arbDaiGateway]
    ),
    // arbL1GatewayRouter->getGateway(_token) -> contracts.mainnet.arbDaiGateway
    // https://etherscan.io/address/0xD3B5b60020504bc3489D6949d545893982BA3011#code#F1#L160
    allow.mainnet.arbitrumBridge.arbL1GatewayRouter.outboundTransfer(
      DAI,
      c.avatar,
      undefined,
      undefined,
      undefined,
      c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"]),
      {
        send: true,
      }
    ),
    // DAI - HOP
    ...allowErc20Approve([DAI], [contracts.mainnet.hop.hopDaiBridge]),
    allow.mainnet.hop.hopDaiBridge.sendToL2(
      42161, // Arbitrum
      c.avatar,
      undefined,
      undefined,
      undefined,
      "0x10720f58Cf4A22fa540ff10430fD967d2ef102de" // Relayer
    ),

    // COMP - Arbitrum Bridge
    ...allowErc20Approve(
      [COMP],
      [contracts.mainnet.arbitrumBridge.arbErc20Gateway]
    ),
    // arbL1GatewayRouter->getGateway(_token) -> contracts.mainnet.arbErc20Gateway
    allow.mainnet.arbitrumBridge.arbL1GatewayRouter.outboundTransfer(
      COMP,
      c.avatar,
      undefined,
      undefined,
      undefined,
      c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"]),
      {
        send: true,
      }
    ),

    // USDC - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      42161, // Arbitrum
      c.avatar
    ),

    // Mainnet -> Base
    // USDC - HOP
    ...allowErc20Approve([USDC], [contracts.mainnet.hop.l1HopCctp]),
    allow.mainnet.hop.l1HopCctp.send(
      8453, // Base
      c.avatar
    ),
  ] satisfies PermissionList
