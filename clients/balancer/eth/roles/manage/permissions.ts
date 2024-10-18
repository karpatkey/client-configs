import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  E_ADDRESS,
  ZERO_ADDRESS,
  AAVE,
  COMP,
  DAI,
  GHO,
  GYD,
  OETH,
  rETH,
  sDAI,
  sUSDS,
  stETH,
  stkAAVE,
  stkGHO,
  SWISE,
  USDC,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
  balancer,
  maverick,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"
import { avatar } from "../../index"

// governance.karpatkey.eth
const GOVERNANCE_KPK = "0x8787FC2De4De95c53e5E3a4e5459247D9773ea52"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of AAVE and GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["AAVE", "GHO"] }),

  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit osETH
  allowAction.aave_v3.deposit({ targets: ["osETH"] }),
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDS
  allowAction.aave_v3.deposit({ targets: ["USDS"] }),
  // Aave v3 - Deposit WBTC
  allowAction.aave_v3.deposit({ targets: ["WBTC"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),

  // Aave - Delegate Aave and stkAave to governance.karpatkey.eth
  // WARNING!: The delegate action allows delegate() and delegateByType(), the latter is not part of the orginal preset
  allowAction.aave_v3.delegate({
    targets: ["AAVE", "stkAAVE"],
    delegatee: GOVERNANCE_KPK,
  }),

  // Convex - ETH/OETH
  allowAction.convex.deposit({ targets: ["174"] }),

  // CowSwap - Swapping of AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allowAction.cowswap.swap({
    sell: [
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    buy: [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH],
    feeAmountBp: 200,
  }),

  // CowSwap - Swapping of DAI, GHO, GYD, sDAI, USDC, USDT
  allowAction.cowswap.swap({
    sell: [DAI, GHO, GYD, sDAI, USDC, USDT],
    buy: [DAI, GHO, GYD, sDAI, USDC, USDT],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap GHO <-> stkGHO
  allowAction.cowswap.swap({
    sell: [GHO, stkGHO],
    buy: [GHO, stkGHO],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap USDS -> [DAI, sUSDS, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [USDS],
    buy: [DAI, sUSDS, USDC, USDT],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap sUSDS -> [DAI, USDC, USDS, USDT]
  allowAction.cowswap.swap({
    sell: [sUSDS],
    buy: [DAI, USDC, USDS, USDT],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap OETH -> [ETH, rETH, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [OETH],
    buy: ["ETH", rETH, stETH, WETH, wstETH],
    feeAmountBp: 200,
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  // WARNING!: With the deposit action we are allowing to send ETH and the functions that involve ETH.
  // allowAction.uniswap_v3.deposit({ tokens: ["WBTC", "WETH"], fees: ["0.3%"] }),
  allowAction.uniswap_v3.deposit({ targets: ["430246"] }), // WARNING!: THIS MUST BE CHANGED BY THE PRECEDING CODE

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave Merit rewards (https://apps.aavechan.com/merit)
  allow.mainnet.aave_v3.merit_distributor.claim([avatar]),

  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Curve - ETH/OETH
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.OETHCRV_f_pool]),
  allow.mainnet.curve.OETHCRV_f_pool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.curve.OETHCRV_f_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.OETHCRV_f_pool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.OETHCRV_f_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.OETHCRV_f_pool],
    [contracts.mainnet.curve.OETHCRV_f_gauge]
  ),
  allow.mainnet.curve.OETHCRV_f_gauge["deposit(uint256)"](),
  allow.mainnet.curve.OETHCRV_f_gauge["withdraw(uint256)"](),
  allow.mainnet.curve.OETHCRV_f_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.OETHCRV_f_gauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.stake_deposit_zap]),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.OETHCRV_f_pool,
    contracts.mainnet.curve.OETHCRV_f_pool,
    contracts.mainnet.curve.OETHCRV_f_gauge,
    2,
    [E_ADDRESS, OETH],
    undefined,
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    { send: true }
  ),

  // Gyroscope - Staking/Unstaking GYD
  allow.mainnet.gyroscope.sGYD.deposit(undefined, c.avatar),
  allow.mainnet.gyroscope.sGYD.redeem(undefined, c.avatar, c.avatar),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
  allow.mainnet.maker.dsr_manager.join(c.avatar),
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Origin - Mint OETH
  allow.mainnet.origin.OETH_Zapper.deposit({ send: true }),
  // Origin - Redeem via ARM (Automated Redemption Manager)
  allowErc20Approve([OETH], [contracts.mainnet.origin.ARM_OETH_WETH]),
  allow.mainnet.origin.ARM_OETH_WETH[
    "swapExactTokensForTokens(address,address,uint256,uint256,address)"
  ](OETH, WETH, undefined, undefined, c.avatar),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.OETH_Vault.requestWithdrawal(),
  allow.mainnet.origin.OETH_Vault.claimWithdrawal(),
  allow.mainnet.origin.OETH_Vault.claimWithdrawals(),

  // StakeWise v3 - Genesis Vault
  allow.mainnet.stakewise_v3.genesis.deposit(c.avatar, undefined, {
    send: true,
  }),
  allow.mainnet.stakewise_v3.genesis.updateState(),
  allow.mainnet.stakewise_v3.genesis.updateStateAndDeposit(
    c.avatar,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.stakewise_v3.genesis.mintOsToken(c.avatar),
  allow.mainnet.stakewise_v3.genesis.burnOsToken(),
  allow.mainnet.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
  allow.mainnet.stakewise_v3.genesis.claimExitedAssets(),

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - Swap COMP -> WETH
  balancer__swap(balancer.B_50COMP_50WETH_pId, [COMP], [WETH]),

  // Balancer - Swap WETH -> DAI
  balancer__swap(balancer.B_60WETH_40DAI_pId, [WETH], [DAI]),

  // Balancer - Swap WETH -> USDC
  balancer__swap(balancer.B_50USDC_50WETH_pId, [WETH], [USDC]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [WETH, wstETH]),

  // Balancer - Swap WETH <-> wstETH
  balancer__swap(balancer.ECLP_wstETH_wETH_pId, [WETH, wstETH], [WETH, wstETH]),

  // Balancer - Swap rETH <-> WETH
  balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

  // Balancer - Swap GYD <-> USDT
  balancer__swap(balancer.ECLP_GYD_USDT_pId, [GYD, USDT], [GYD, USDT]),

  // Balancer - Swap GYD <-> sDAI
  balancer__swap(balancer.ECLP_GYD_sDAI_pId, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - Swap GYD <-> sDAI
  balancer__swap(balancer.ECLP_GYD_sDAI_2_pId, [GYD, sDAI], [GYD, sDAI]),

  // Balancer - Swap GYD <-> USDC
  balancer__swap(balancer.ECLP_GYD_USDC_pId, [GYD, USDC], [GYD, USDC]),

  // Balancer - Swap GHO <-> GYD
  balancer__swap(balancer.ECLP_GHO_GYD_pId, [GHO, GYD], [GHO, GYD]),

  // Balancer - Swap GHO <-> [USDC, USDT]
  balancer__swap(balancer.GHO_USDT_USDC_pId, [GHO], [USDC, USDT]),
  balancer__swap(balancer.GHO_USDT_USDC_pId, [USDC, USDT], [GHO]),

  // Curve - Swap ETH <-> stETH
  allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - Swap ETH <-> OETH
  allowErc20Approve([OETH], [contracts.mainnet.curve.OETHCRV_f_pool]),
  allow.mainnet.curve.OETHCRV_f_pool["exchange(int128,int128,uint256,uint256)"](
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Maverick - Swap GHO <-> stkGHO
  allowErc20Approve(
    [GHO, stkGHO],
    [contracts.mainnet.maverick.MaverickV2Router]
  ),
  allow.mainnet.maverick.MaverickV2Router.inputSingleWithTickLimit(
    c.avatar,
    maverick.GHO_stkGHO_pool
  ),

  // Uniswap v3 - Swaps
  allowErc20Approve(
    [
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.uniswap_v3.router_2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(
      AAVE,
      COMP,
      DAI,
      rETH,
      stETH,
      stkAAVE,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH
    ),
    tokenOut: c.or(DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH),
    recipient: c.avatar,
  }),

  /*********************************************
   * Bridge
   *********************************************/
  // GNO (Mainnet) -> GNO (Gnosis)
  /*
  ...allowErc20Approve([GNO], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge["relayTokens(address,address,uint256)"](
    GNO,
    c.avatar
  ),

  // Claim bridged GNO from Gnosis
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
        value: GNO.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + GNO.slice(22, 42), // Last 10 bytes of the token address
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
  */
] satisfies PermissionList
