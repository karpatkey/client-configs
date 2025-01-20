import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  ETHx,
  LDO,
  osETH,
  rETH,
  RPL,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  eAddress,
  zeroAddress,
  wstETH,
  balancer,
  curve,
  OETH,
  USDM,
  x3CRV,
  sDAI,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancerSwap } from "../../../../../helpers/exit_strategies"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Ankr
  allowAction.ankr.deposit(),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Aave v3 Core Market - Deposit DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 Core Market - Deposit ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 Core Market - Deposit osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 Core Market - Deposit USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 Core Market - Deposit WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 Core Market - Deposit USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 Core Market - Deposit USDS
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDS"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - WETH/osETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),

  // Convex - ETH/stETH - stETH-ng-f
  allowAction.convex.deposit({ targets: ["177"] }),

  // CowSwap - [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH] ->
  // [DAI, rETH, USDC, USDT, stETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
    buy: [DAI, rETH, USDC, USDT, stETH, WETH, wstETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - Deposit ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - Deposit WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - Deposit USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),

  // Stader
  allowAction.stader.deposit(),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Compound v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Compound v3 - Deposit USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.compoundV3.cUsdtV3]),
  allow.mainnet.compoundV3.cUsdtV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdtV3.withdraw(USDC),

  // Compound v3 - Deposit ETH
  allow.mainnet.compoundV3.cWethV3.allow(
    contracts.mainnet.compoundV3.mainnetBulker
  ),
  allow.mainnet.compoundV3.mainnetBulker.invoke(
    c.every(
      c.or(
        c.eq(
          "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000" // ACTION_SUPPLY_NATIVE_TOKEN
        ),
        c.eq(
          "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000" // ACTION_WITHDRAW_NATIVE_TOKEN
        )
      )
    ),
    c.every(
      c.abiEncodedMatches(
        [contracts.mainnet.compoundV3.cWethV3, c.avatar],
        ["address", "address", "uint256"]
      )
    ),
    { send: true }
  ),

  // Compound v3 - Claim rewards
  allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

  // Curve - ETH/stETH - steCRV
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool.add_liquidity(undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.steCrvPool.remove_liquidity(),
  allow.mainnet.curve.steCrvPool.remove_liquidity_one_coin(),
  allow.mainnet.curve.steCrvPool.remove_liquidity_imbalance(),
  ...allowErc20Approve(
    [curve.steCrv],
    [contracts.mainnet.curve.steCrvPoolGauge]
  ),
  allow.mainnet.curve.steCrvPoolGauge["deposit(uint256)"](),
  allow.mainnet.curve.steCrvPoolGauge.withdraw(),
  allow.mainnet.curve.steCrvPoolGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.steCrvPoolGauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.steCrvPoolGauge.set_approve_deposit(
    contracts.mainnet.curve.stakeDepositZap
  ),

  // Curve - ETH/stETH - stETH-ng-f
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stEthNgfPool]),
  allow.mainnet.curve.stEthNgfPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    { send: true }
  ),
  allow.mainnet.curve.stEthNgfPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.stEthNgfPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.stEthNgfPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.stEthNgfPool],
    [contracts.mainnet.curve.stEthNgfGauge]
  ),
  allow.mainnet.curve.stEthNgfGauge["deposit(uint256)"](),
  allow.mainnet.curve.stEthNgfGauge["withdraw(uint256)"](),
  allow.mainnet.curve.stEthNgfGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.stEthNgfGauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stakeDepositZap]),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steCrvPool,
      contracts.mainnet.curve.stEthNgfPool
    ),
    c.or(curve.steCrv, contracts.mainnet.curve.stEthNgfPool),
    c.or(
      contracts.mainnet.curve.steCrvPoolGauge,
      contracts.mainnet.curve.stEthNgfGauge
    ),
    2,
    [eAddress, stETH],
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress,
    { send: true }
  ),

  //Curve - oETH/ETH
  ...allowErc20Approve(
    [OETH],
    [
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.oEthCrvGauge,
      contracts.mainnet.curve.crvDepositAndStakeZap,
    ]
  ),
  //swap
  allow.mainnet.curve.oEthCrvPool.exchange(
    undefined,
    undefined,
    undefined,
    [contracts.mainnet.curve.oEthCrvPool, zeroAddress],
    {
      send: true,
    }
  ),
  //deposit
  allow.mainnet.curve.oEthCrvPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  //stake
  allow.mainnet.curve.oEthCrvGauge.deposit({
    send: true,
  }),
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.crvDepositAndStakeZap]),
  allow.mainnet.curve.crvDepositAndStakeZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.oEthCrvPool,
    contracts.mainnet.curve.oEthCrvPool,
    contracts.mainnet.curve.oEthCrvGauge,
    2,
    [eAddress, OETH],
    undefined,
    undefined,
    false,
    false,
    zeroAddress,
    {
      send: true,
    }
  ),
  //withdraw/claim
  allow.mainnet.curve.oEthCrvPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.oEthCrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["withdraw(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.oEthCrvGauge),

  //Curve DAI-USDC-USDT
  //swap
  allow.mainnet.curve.x3CrvPool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  //Deposit
  ...allowErc20Approve([DAI], [contracts.mainnet.dai]),
  ...allowErc20Approve([USDC], [contracts.mainnet.dai]),
  ...allowErc20Approve([USDT], [contracts.mainnet.usdc]),
  allow.mainnet.curve.x3CrvPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  //Stake
  ...allowErc20Approve([x3CRV], [contracts.mainnet.curve.crvDaiUsdtUsdtGauge]),
  allow.mainnet.curve.crvDaiUsdtUsdtGauge.deposit({
    send: true,
  }),
  //Deposit and stake
  allow.mainnet.curve.crvDaiUsdtUsdtGauge.set_approve_deposit(
    contracts.mainnet.curve.crvDepositAndStakeZap,
    true,
    {
      send: true,
    }
  ),
  ...allowErc20Approve(
    [x3CRV],
    [contracts.mainnet.curve.crvDepositAndStakeZap]
  ),
  allow.mainnet.curve.crvDepositAndStakeZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.x3CrvPool,
    x3CRV,
    contracts.mainnet.curve.crvDaiUsdtUsdtGauge,
    3,
    [DAI, USDC, USDT],
    undefined,
    undefined,
    false,
    false,
    zeroAddress,
    {
      send: true,
    }
  ),
  //withdraw/claim
  allow.mainnet.curve.x3CrvPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.x3CrvPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.x3CrvPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.crvDaiUsdtUsdtGauge["deposit(uint256)"](),
  allow.mainnet.curve.crvDaiUsdtUsdtGauge["withdraw(uint256)"](),
  allow.mainnet.curve.crvDaiUsdtUsdtGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(
    contracts.mainnet.curve.crvDaiUsdtUsdtGauge
  ),

  //Curve sDAI - USDM
  //swap
  allow.mainnet.curve.sDaiUsdmPool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  //Deposit
  ...allowErc20Approve([sDAI], [contracts.mainnet.curve.sDaiUsdmPool]),
  allow.mainnet.curve.sDaiUsdmPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  //Stake
  ...allowErc20Approve([sDAI], [contracts.mainnet.curve.crvLiquidityGaugeV6]),
  allow.mainnet.curve.crvLiquidityGaugeV6.deposit({
    send: true,
  }),
  //Deposit and stake
  ...allowErc20Approve([sDAI], [contracts.mainnet.curve.crvDepositAndStakeZap]),
  allow.mainnet.curve.crvLiquidityGaugeV6.set_approve_deposit(
    contracts.mainnet.curve.crvDepositAndStakeZap,
    true,
    {
      send: true,
    }
  ),
  allow.mainnet.curve.crvDepositAndStakeZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    contracts.mainnet.curve.sDaiUsdmPool,
    x3CRV,
    contracts.mainnet.curve.crvLiquidityGaugeV6,
    2,
    [sDAI, USDM],
    undefined,
    undefined,
    false,
    true,
    zeroAddress,
    {
      send: true,
    }
  ),
  //withdraw/claim
  allow.mainnet.curve.sDaiUsdmPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.sDaiUsdmPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.sDaiUsdmPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.crvLiquidityGaugeV6["deposit(uint256)"](),
  allow.mainnet.curve.crvLiquidityGaugeV6["withdraw(uint256)"](),
  allow.mainnet.curve.crvLiquidityGaugeV6["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(
    contracts.mainnet.curve.crvLiquidityGaugeV6
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

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - AURA -> WETH
  balancerSwap(balancer.b50Weth50AuraPid, [AURA], [WETH]),
  // Balancer - BAL -> WETH
  balancerSwap(balancer.b80Bal20WethPid, [BAL], [WETH]),
  // Balancer - WETH -> DAI
  balancerSwap(balancer.b60Weth40DaiPid, [WETH], [DAI]),
  // Balancer - WETH -> USDC
  balancerSwap(balancer.b50Usdc50WethPid, [WETH], [USDC]),
  // Balancer - COMP -> WETH
  balancerSwap(balancer.b50Comp50WethPid, [COMP], [WETH]),
  // Balancer - WETH <-> wstETH
  balancerSwap(balancer.bStEthStablePid, [WETH, wstETH], [WETH, wstETH]),
  // Balancer - WETH <-> wstETH
  balancerSwap(balancer.eclpWstEthWethPid, [WETH, wstETH], [WETH, wstETH]),
  // Balancer - rETH <-> WETH
  balancerSwap(balancer.bREthStablePid, [rETH, WETH], [rETH, WETH]),
  // Balancer - ankrETH <-> wstETH
  balancerSwap(balancer.ankrEthWstEthPid, [ankrETH, wstETH], [ankrETH, wstETH]),
  // Balancer - ETHx <-> WETH
  balancerSwap(balancer.ethxWethPid, [ETHx, WETH], [ETHx, WETH]),
  // Balancer - osETH <-> WETH
  balancerSwap(balancer.osEthWethPid, [osETH, WETH], [osETH, WETH]),
  // Balancer - oETH <-> WETH
  balancerSwap(balancer.oEthWethPid, [OETH, WETH], [OETH, WETH]),
  // Balancer - USDC <-> USDT
  balancerSwap(balancer.usdcUsdtPid, [USDC, USDT], [USDC, USDT]),

  // Curve - ETH <-> stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
  allow.mainnet.curve.steCrvPool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.exchange(),

  // Curve - CVX -> ETH
  ...allowErc20Approve([CVX], [contracts.mainnet.curve.cvxEthPool]),
  allow.mainnet.curve.cvxEthPool["exchange(uint256,uint256,uint256,uint256)"](
    1,
    0
  ),

  // Curve - ankrETH <-> ETH
  ...allowErc20Approve([ankrETH], [contracts.mainnet.curve.ankrEthPool]),
  allow.mainnet.curve.ankrEthPool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // PancakeSwap - ETHx <-> WETH
  ...allowErc20Approve(
    [ETHx, WETH],
    [contracts.mainnet.pancakeSwap.smartRouter]
  ),
  allow.mainnet.pancakeSwap.smartRouter.exactInputSingle({
    tokenIn: c.or(ETHx, WETH),
    tokenOut: c.or(ETHx, WETH),
    recipient: c.avatar,
  }),

  // Uniswap v3 - [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH] ->
  // [DAI, rETH, USDC, USDT, stETH, WETH, wstETH]
  ...allowErc20Approve(
    [
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      USDM,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(
      ankrETH,
      AURA,
      BAL,
      COMP,
      CRV,
      CVX,
      DAI,
      ETHx,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH
    ),
    tokenOut: c.or(DAI, rETH, USDC, USDT, stETH, WETH, wstETH),
    recipient: c.avatar,
  }),

  // Uniswap v3 - [ETH <-> USDT], Fee: [0.3, 0.05]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(WETH, USDT),
    tokenOut: c.or(WETH, USDT),
    recipient: c.avatar,
    fee: c.or(30, 500),
  }),
  // Uniswap v3 - [ETH <-> USDC], Fee: [0.3, 0.05]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(WETH, USDC),
    tokenOut: c.or(WETH, USDC),
    recipient: c.avatar,
    fee: c.or(30, 500),
  }),
  // Uniswap v3 - [USDM <-> USDT], Fee: [0.05]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDM, USDT),
    tokenOut: c.or(USDM, USDT),
    recipient: c.avatar,
    fee: 500,
  }),
  // Uniswap v3 - [USDC <-> USDT], Fee: [0.01]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDC, USDT),
    tokenOut: c.or(USDT, USDC),
    recipient: c.avatar,
    fee: 100,
  }),
  // Uniswap v3 - [ETH <-> USDT], Fee: [0.01, 0.05]
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(WETH, USDT),
    tokenOut: c.or(USDT, WETH),
    recipient: c.avatar,
    fee: c.or(100, 500),
  }),
] satisfies PermissionList
