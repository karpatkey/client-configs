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
  GNO,
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
  allow.mainnet.aaveV3.meritDistributor.claim([avatar]),

  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

  // Curve - ETH/OETH
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
  allow.mainnet.curve.oEthCrvPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.curve.oEthCrvPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.oEthCrvPool],
    [contracts.mainnet.curve.oEthCrvGauge]
  ),
  allow.mainnet.curve.oEthCrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["withdraw(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.oEthCrvGauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.stakeDepositZap]),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.oEthCrvPool,
    contracts.mainnet.curve.oEthCrvPool,
    contracts.mainnet.curve.oEthCrvGauge,
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
  allow.mainnet.gyroscope.sGyd.deposit(undefined, c.avatar),
  allow.mainnet.gyroscope.sGyd.redeem(undefined, c.avatar, c.avatar),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  allowErc20Approve([DAI], [contracts.mainnet.maker.dsrManager]),
  allow.mainnet.maker.dsrManager.join(c.avatar),
  allow.mainnet.maker.dsrManager.exit(c.avatar),
  allow.mainnet.maker.dsrManager.exitAll(c.avatar),

  // Origin - Mint OETH
  allow.mainnet.origin.oEthZapper.deposit({ send: true }),
  // Origin - Redeem via ARM (Automated Redemption Manager)
  allowErc20Approve([OETH], [contracts.mainnet.origin.armOethWeth]),
  allow.mainnet.origin.armOethWeth[
    "swapExactTokensForTokens(address,address,uint256,uint256,address)"
  ](OETH, WETH, undefined, undefined, c.avatar),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.oEthVault.requestWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawals(),

  // StakeWise v3 - Genesis Vault
  allow.mainnet.stakeWiseV3.genesis.deposit(c.avatar, undefined, {
    send: true,
  }),
  allow.mainnet.stakeWiseV3.genesis.updateState(),
  allow.mainnet.stakeWiseV3.genesis.updateStateAndDeposit(
    c.avatar,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.stakeWiseV3.genesis.mintOsToken(c.avatar),
  allow.mainnet.stakeWiseV3.genesis.burnOsToken(),
  allow.mainnet.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.mainnet.stakeWiseV3.genesis.claimExitedAssets(),

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
  allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - Swap ETH <-> OETH
  allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
  allow.mainnet.curve.oEthCrvPool["exchange(int128,int128,uint256,uint256)"](
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Maverick - Swap GHO <-> stkGHO
  allowErc20Approve([GHO, stkGHO], [contracts.mainnet.maverick.v2Router]),
  allow.mainnet.maverick.v2Router.inputSingleWithTickLimit(
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
    [contracts.mainnet.uniswapV3.router2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allow.mainnet.uniswapV3.router2.exactInputSingle({
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
  // DAI (Mainnet) -> XDAI (Gnosis)
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

  // GNO (Mainnet) -> GNO (Gnosis)
  ...allowErc20Approve([GNO], [contracts.mainnet.gnoOmnibridge]),
  allow.mainnet.gnoOmnibridge["relayTokens(address,address,uint256)"](
    GNO,
    c.avatar
  ),

  // Claim bridged GNO from Gnosis
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
] satisfies PermissionList
