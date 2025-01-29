import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  eAddress,
  zeroAddress,
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
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancerSwap } from "../../../../../helpers/exit_strategies"
import { Parameters } from "../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * DeFi-Kit permissions
     *********************************************/
    // Aave Safety Module - Stake AAVE and GHO
    allowAction.aave_v3.stake({ targets: ["AAVE", "GHO"] }),

    // Aave v3 Core Market - Deposit DAI
    allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
    // Aave v3 Core Market - Deposit osETH
    allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
    // Aave v3 Core Market - Deposit sDAI
    allowAction.aave_v3.deposit({ market: "Core", targets: ["sDAI"] }),
    // Aave v3 Core Market - Deposit USDC
    allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
    // Aave v3 Core Market - Deposit USDS
    allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),
    // Aave v3 Core Market - Deposit WBTC
    allowAction.aave_v3.deposit({ market: "Core", targets: ["WBTC"] }),
    // Aave v3 Core Market - Deposit wstETH
    allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),
    // Aave v3 Core Market - Borrow GHO
    allowAction.aave_v3.borrow({ market: "Core", targets: ["GHO"] }),

    // Aave - Delegate AAVE and stkAAVE to governance.karpatkey.eth
    // WARNING!: The delegate action allows delegate() and delegateByType(), the latter is not part of the orginal preset
    allowAction.aave_v3.delegate({
      targets: ["AAVE", "stkAAVE"],
      delegatee: parameters.kpkGovernance,
    }),

    // Convex - ETH/OETH
    allowAction.convex.deposit({ targets: ["174"] }),

    // CowSwap - [AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH] ->
    // [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH]
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

    // CowSwap - [DAI, GHO, GYD, sDAI, USDC, USDT] <-> [DAI, GHO, GYD, sDAI, USDC, USDT]
    allowAction.cowswap.swap({
      sell: [DAI, GHO, GYD, sDAI, USDC, USDT],
      buy: [DAI, GHO, GYD, sDAI, USDC, USDT],
      feeAmountBp: 200,
    }),

    // CowSwap - GHO <-> stkGHO
    allowAction.cowswap.swap({
      sell: [GHO, stkGHO],
      buy: [GHO, stkGHO],
      feeAmountBp: 200,
    }),

    // CowSwap - USDS -> [DAI, sUSDS, USDC, USDT]
    allowAction.cowswap.swap({
      sell: [USDS],
      buy: [DAI, sUSDS, USDC, USDT],
      feeAmountBp: 200,
    }),

    // CowSwap - sUSDS -> [DAI, USDC, USDS, USDT]
    allowAction.cowswap.swap({
      sell: [sUSDS],
      buy: [DAI, USDC, USDS, USDT],
      feeAmountBp: 200,
    }),

    // CowSwap - OETH -> [ETH, rETH, stETH, WETH, wstETH]
    allowAction.cowswap.swap({
      sell: [OETH],
      buy: ["ETH", rETH, stETH, WETH, wstETH],
      feeAmountBp: 200,
    }),

    // Lido
    allowAction.lido.deposit(),

    // Rocket Pool
    allowAction.rocket_pool.deposit(),

    // Spark - DSR_sDAI
    allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
    // Spark - SKY_USDS
    allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

    // StakeWise v3 - Genesis Vault
    allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

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
    allow.mainnet.aaveV3.meritDistributor.claim([parameters.avatar]),

    // Compound v3 - Deposit USDC
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
      [eAddress, OETH],
      undefined,
      undefined,
      undefined,
      undefined,
      zeroAddress,
      { send: true }
    ),

    // Gyroscope - Staking/Unstaking GYD
    ...allowErc20Approve([GYD], [contracts.mainnet.gyroscope.sGyd]),
    allow.mainnet.gyroscope.sGyd.deposit(undefined, c.avatar),
    allow.mainnet.gyroscope.sGyd.redeem(undefined, c.avatar, c.avatar),

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

    // Sky - DSR (DAI Savings Rate)
    // The DsrManager provides an easy to use smart contract that allows
    // service providers to deposit/withdraw dai into the DSR contract pot,
    // and activate/deactivate the Dai Savings Rate to start earning savings
    // on a pool of dai in a single function call.
    // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
    allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
    allow.mainnet.sky.dsrManager.join(c.avatar),
    allow.mainnet.sky.dsrManager.exit(c.avatar),
    allow.mainnet.sky.dsrManager.exitAll(c.avatar),

    /*********************************************
     * SWAPS
     *********************************************/
    // Balancer - COMP -> WETH
    balancerSwap(balancer.b50Comp50WethPid, [COMP], [WETH]),

    // Balancer - WETH -> DAI
    balancerSwap(balancer.b60Weth40DaiPid, [WETH], [DAI]),

    // Balancer - WETH -> USDC
    balancerSwap(balancer.b50Usdc50WethPid, [WETH], [USDC]),

    // Balancer - WETH <-> wstETH
    balancerSwap(balancer.bStEthStablePid, [WETH, wstETH], [WETH, wstETH]),

    // Balancer - WETH <-> wstETH
    balancerSwap(balancer.eclpWstEthWethPid, [WETH, wstETH], [WETH, wstETH]),

    // Balancer - rETH <-> WETH
    balancerSwap(balancer.bREthStablePid, [rETH, WETH], [rETH, WETH]),

    // Balancer - GYD <-> USDT
    balancerSwap(balancer.eclpGydUsdtPid, [GYD, USDT], [GYD, USDT]),

    // Balancer - GYD <-> sDAI
    balancerSwap(balancer.eclpGydSdaiPid, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - GYD <-> sDAI
    balancerSwap(balancer.eclpGydSdai2Pid, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - GYD <-> USDC
    balancerSwap(balancer.eclpGydUsdcPid, [GYD, USDC], [GYD, USDC]),

    // Balancer - GHO <-> GYD
    balancerSwap(balancer.eclpGhoGydPid, [GHO, GYD], [GHO, GYD]),

    // Balancer - GHO <-> [USDC, USDT]
    balancerSwap(balancer.ghoUsdtUsdcPid, [GHO], [USDC, USDT]),
    balancerSwap(balancer.ghoUsdtUsdcPid, [USDC, USDT], [GHO]),

    // Curve - ETH <-> stETH
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

    // Curve - ETH <-> OETH
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

    // Uniswap v3 - [AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH] ->
    // [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH]
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
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
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
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
  ] satisfies PermissionList
