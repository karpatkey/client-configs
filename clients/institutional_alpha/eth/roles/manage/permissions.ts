import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  ZERO_ADDRESS,
  crvUSD,
  DAI,
  sDAI,
  USDC,
  USDM,
  USDT,
  WBTC,
  wM,
  morpho,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of GHO in Safety Module
  allowAction.aaveV2.stake({ targets: ["GHO"] }),
  // Aave v3 - Deposit USDT
  allowAction.aaveV3.deposit({ targets: ["USDT"] }),

  // Convex - crvUSD/USDT
  allowAction.convex.deposit({ targets: ["179"] }),

  // CowSwap - [DAI, USDC, USDM] <-> [DAI, USDC, USDM]
  allowAction.cowSwap.swap({ sell: [DAI, USDC, USDM], buy: [DAI, USDC, USDM] }),

  // CowSwap - [USDC, wM] <-> [USDC, wM]
  allowAction.cowSwap.swap({ sell: [USDC, wM], buy: [USDC, wM] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
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
      currencyId: 2, // USDT
    })
  ),
  allow.mainnet.notional_v3.nProxy.nTokenClaimIncentives(),

  /*********************************************
   * Swaps
   *********************************************/
  // Curve - Swap sDAI <-> USDM
  allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sdai_usdm_pool]),
  allow.mainnet.curve.sdai_usdm_pool[
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
] satisfies PermissionList
