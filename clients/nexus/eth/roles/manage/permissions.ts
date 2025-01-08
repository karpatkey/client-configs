import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  AURA,
  BAL,
  cbBTC,
  CRV,
  CVX,
  DAI,
  GHO,
  LDO,
  NXM,
  osETH,
  rETH,
  RPL,
  sUSDe,
  sUSDS,
  stETH,
  SWISE,
  USDC,
  USDe,
  USDS,
  USDT,
  USR,
  WETH,
  wNXM,
  wstETH,
  zeroAddress,
  curve,
  nexus,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - DAI
  allowAction.aave_v3.deposit({ market: "Core", targets: ["DAI"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["ETH"] }),
  // Aave v3 - osETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["osETH"] }),
  // Aave v3 - rETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["rETH"] }),
  // Aave v3 - USDC
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
  // Aave v3 - USDT
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDT"] }),
  // Aave v3 - WETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["WETH"] }),
  // Aave v3 - wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["wstETH"] }),
  // Aave v3 - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - GHO/USDT/USDC
  allowAction.aura.deposit({ targets: ["157"] }),
  // Aura - sDAI/3Pool
  allowAction.aura.deposit({ targets: ["186"] }),
  // Aura - Gyroscope ECLP GHO/USDC 2
  allowAction.aura.deposit({ targets: ["195"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - osETH/WETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - GHO/USDT/USDC
  allowAction.balancer.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer.stake({ targets: ["GHO/USDT/USDC"] }),
  // Balancer - sDAI/3Pool
  allowAction.balancer.deposit({ targets: ["sDAI/3Pool"] }),
  allowAction.balancer.stake({ targets: ["sDAI/3Pool"] }),
  // Balancer - Gyroscope ECLP GHO/USDC 2
  allowAction.balancer.deposit({ targets: ["ECLP-GHO-USDC-2"] }),
  allowAction.balancer.stake({ targets: ["ECLP-GHO-USDC-2"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),

  // CowSwap - [AAVE, AURA, BAL, CRV, CVX, DAI, ETH, GHO, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wNXM, wstETH] ->
  // [DAI, ETH, GHO, osETH, rETH, stETH, USDC, USDT, WETH, wNXM, wstETH]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      AAVE,
      AURA,
      BAL,
      CRV,
      CVX,
      DAI,
      GHO,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wNXM,
      wstETH,
    ],
    buy: ["ETH", DAI, GHO, osETH, rETH, stETH, USDC, USDT, WETH, wNXM, wstETH],
  }),

  // CowSwap - [GHO, USDS, USDe, USR, sUSDS, sUSDe] -> [GHO, USDC, USDS, USDe, USR, WNXM, sUSDS, sUSDe, wETH, wstETH]
  allowAction.cowswap.swap({
    sell: [GHO, USDS, USDe, USR, sUSDS, sUSDe],
    buy: [GHO, USDC, USDS, USDe, USR, wNXM, sUSDS, sUSDe, WETH, wstETH],
  }),

  // CowSwap - [ETH, GHO, stETH, sUSDe, sUSDS, USDC, USDe, USDS, USR, WETH, WNXM, wstETH] -> [cbBTC, sUSDe, sUSDS, USDe, USDS, USR]
  allowAction.cowswap.swap({
    sell: [
      "ETH",
      GHO,
      stETH,
      sUSDe,
      sUSDS,
      USDC,
      USDe,
      USDS,
      USR,
      WETH,
      wNXM,
      wstETH,
    ],
    buy: [cbBTC, sUSDe, sUSDS, USDe, USDS, USR],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - SKY_USDS
  allowAction.spark.deposit({ targets: ["SKY_USDS"] }),
  // Spark - ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - rETH
  allowAction.spark.deposit({ targets: ["rETH"] }),
  // Spark - USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - wstETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis"] }),

  // Uniswap v3 - wNXN/WETH
  allowAction.uniswap_v3.deposit({ tokens: ["wNXM", "WETH"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave v3 - Lido Market - ETH
  ...allowErc20Approve(
    [contracts.mainnet.aaveV3.aEthWeth],
    [contracts.mainnet.aaveV3.wrappedTokenGatewayPrimeV3]
  ),
  allow.mainnet.aaveV3.wrappedTokenGatewayPrimeV3.depositETH(
    contracts.mainnet.aaveV3.poolPrimeV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.aaveV3.wrappedTokenGatewayPrimeV3.withdrawETH(
    contracts.mainnet.aaveV3.poolPrimeV3,
    undefined,
    c.avatar
  ),

  // Aave v3 - Lido Market - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aaveV3.poolPrimeV3]),
  allow.mainnet.aaveV3.poolPrimeV3.supply(USDC, undefined, c.avatar),
  allow.mainnet.aaveV3.poolPrimeV3.withdraw(USDC, undefined, c.avatar),

  // Aave v3 - Lido Market - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aaveV3.poolPrimeV3]),
  allow.mainnet.aaveV3.poolPrimeV3.supply(WETH, undefined, c.avatar),
  allow.mainnet.aaveV3.poolPrimeV3.withdraw(WETH, undefined, c.avatar),

  // Aave v3 - Lido Market - wstETH
  ...allowErc20Approve([wstETH], [contracts.mainnet.aaveV3.poolPrimeV3]),
  allow.mainnet.aaveV3.poolPrimeV3.supply(wstETH, undefined, c.avatar),
  allow.mainnet.aaveV3.poolPrimeV3.withdraw(wstETH, undefined, c.avatar),

  // Balancer - BCoW AMM wNXM/WETH (Staking not available)
  ...allowErc20Approve(
    [wNXM, WETH],
    [contracts.mainnet.balancer.bCow50Wnxm50Weth]
  ),
  allow.mainnet.balancer.bCow50Wnxm50Weth.joinPool(),
  allow.mainnet.balancer.bCow50Wnxm50Weth.exitPool(),

  // Compound v3 - ETH
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

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Compound v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.compoundV3.cUsdtV3]),
  allow.mainnet.compoundV3.cUsdtV3.supply(USDT),
  allow.mainnet.compoundV3.cUsdtV3.withdraw(USDT),

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

  // Curve - osETH/rETH
  ...allowErc20Approve([osETH], [contracts.mainnet.curve.osEthRethPool]),
  ...allowErc20Approve([rETH], [contracts.mainnet.curve.osEthRethPool]),

  allow.mainnet.curve.osEthRethPool["add_liquidity(uint256[],uint256)"](),
  allow.mainnet.curve.osEthRethPool["remove_liquidity(uint256,uint256[])"](),
  allow.mainnet.curve.osEthRethPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.osEthRethPool[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.osEthRethPool],
    [contracts.mainnet.curve.osEthRethGauge]
  ),
  allow.mainnet.curve.osEthRethGauge["deposit(uint256)"](),
  allow.mainnet.curve.osEthRethGauge["withdraw(uint256)"](),
  allow.mainnet.curve.osEthRethGauge["withdraw(uint256,bool)"](),
  allow.mainnet.curve.osEthRethGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.osEthRethGauge),

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
  ...allowErc20Approve([DAI], [contracts.mainnet.maker.dsrManager]),
  allow.mainnet.maker.dsrManager.join(c.avatar),
  allow.mainnet.maker.dsrManager.exit(c.avatar),
  allow.mainnet.maker.dsrManager.exitAll(c.avatar),

  // Nexus Mutual
  // Deposit ETH in exchange for NXM; redeem NXM in exchange for ETH
  allow.mainnet.nexus.ramm.swap(undefined, undefined, undefined, {
    send: true,
  }),
  ...allowErc20Approve([NXM], [contracts.mainnet.nexus.wNxm]),
  // Wrap NXM
  allow.mainnet.nexus.wNxm.wrap(),
  // Unwrap WNXM
  allow.mainnet.nexus.wNxm.unwrap(),
  // Claim NXM rewards
  allow.mainnet.nexus.tokenController.withdrawNXM(),
  // Approval of NXM with the TokenController as spender was already included
  // TokenController manages the approvals for all pools
  ...allowErc20Approve([NXM], [contracts.mainnet.nexus.tokenController]),
  // Allows users to deposit NXM into the pool, creating stake and rewards shares in return
  // Supports deposits to specific tranches and allows reusing the same nft for deposits in multiple tranches to an existing deposit
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.stakingPool.depositTo(
      undefined,
      undefined,
      undefined,
      zeroAddress
    ),
    targetAddress: pool,
  })),
  // Extends the duration of a deposit by moving it from an tranche to a future tranche
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.stakingPool.extendDeposit(),
    targetAddress: pool,
  })),
  // Allows users to withdraw their stake and/or rewards from specific tranches
  // Withdrawing the stakes can be done only on expired tranches
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.stakingPool.withdraw(),
    targetAddress: pool,
  })),

  // Resolv - Stake/Unstake USR
  ...allowErc20Approve([USR], [contracts.mainnet.resolv.stUsr]),
  allow.mainnet.resolv.stUsr["deposit(uint256)"](),
  ...allowErc20Approve([contracts.mainnet.resolv.stUsr], [USR]),
  allow.mainnet.resolv.stUsr["withdraw(uint256)"](),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - Swap osETH for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xdacf5fa19b1f720111609043ac67a9818262850c000000000000000000000635",
      assetIn: osETH,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for osETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xdacf5fa19b1f720111609043ac67a9818262850c000000000000000000000635",
      assetIn: WETH,
      assetOut: osETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Uniswap v3 - Swaps
  ...allowErc20Approve(
    [
      AAVE,
      AURA,
      BAL,
      CRV,
      CVX,
      DAI,
      GHO,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wNXM,
      wstETH,
    ],
    [contracts.mainnet.uniswapV3.router2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, AURA, BAL, CRV, CVX, DAI, GHO, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, WNXM, wstETH
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(
      AAVE,
      AURA,
      BAL,
      CRV,
      CVX,
      DAI,
      GHO,
      LDO,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wNXM,
      wstETH
    ),
    tokenOut: c.or(
      DAI,
      GHO,
      osETH,
      rETH,
      stETH,
      USDC,
      USDT,
      WETH,
      wNXM,
      wstETH
    ),
    recipient: c.avatar,
  }),
] satisfies PermissionList
