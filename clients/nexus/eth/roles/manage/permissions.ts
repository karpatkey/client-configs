import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  AURA,
  BAL,
  CRV,
  CVX,
  DAI,
  GHO,
  LDO,
  NXM,
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
  ZERO_ADDRESS,
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
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ targets: ["ETH"] }),
  // Aave v3 - osETH
  allowAction.aave_v3.deposit({ targets: ["osETH"] }),
  // Aave v3 - rETH
  allowAction.aave_v3.deposit({ targets: ["rETH"] }),
  // Aave v3 - USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - USDT
  allowAction.aave_v3.deposit({ targets: ["USDT"] }),
  // Aave v3 - WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
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

  // CowSwap
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

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocketPool.deposit(),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
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

  // Uniswap v3 - wNXN/WETH
  allowAction.uniswapV3.deposit({ tokens: ["wNXM", "WETH"] }),

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
    [contracts.mainnet.aave_v3.aEthWETH],
    [contracts.mainnet.aave_v3.wrapped_token_gateway_lido_v3]
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_lido_v3.depositETH(
    contracts.mainnet.aave_v3.pool_lido,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_lido_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_lido,
    undefined,
    c.avatar
  ),

  // Aave v3 - Lido Market - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(WETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(WETH, undefined, c.avatar),

  // Aave v3 - Lido Market - wstETH
  ...allowErc20Approve([wstETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(wstETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(wstETH, undefined, c.avatar),

  // Balancer - BCoW AMM wNXM/WETH (Staking not available)
  ...allowErc20Approve(
    [wNXM, WETH],
    [contracts.mainnet.balancer.BCoW_50wNXM_50WETH]
  ),
  allow.mainnet.balancer.BCoW_50wNXM_50WETH.joinPool(),
  allow.mainnet.balancer.BCoW_50wNXM_50WETH.exitPool(),

  // Compound v3 - ETH
  allow.mainnet.compound_v3.cWETHv3.allow(
    contracts.mainnet.compound_v3.MainnetBulker
  ),
  allow.mainnet.compound_v3.MainnetBulker.invoke(
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
        [contracts.mainnet.compound_v3.cWETHv3, c.avatar],
        ["address", "address", "uint256"]
      )
    ),
    { send: true }
  ),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.compound_v3.cUSDTv3]),
  allow.mainnet.compound_v3.cUSDTv3.supply(USDT),
  allow.mainnet.compound_v3.cUSDTv3.withdraw(USDT),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Curve - ETH/stETH - steCRV
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.add_liquidity(undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_one_coin(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_imbalance(),
  ...allowErc20Approve(
    [curve.steCRV],
    [contracts.mainnet.curve.steth_eth_gauge]
  ),
  allow.mainnet.curve.steth_eth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.steth_eth_gauge.withdraw(),
  allow.mainnet.curve.steth_eth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.steth_eth_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.steth_eth_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap
  ),

  // Curve - osETH/rETH
  ...allowErc20Approve([osETH], [contracts.mainnet.curve.oseth_reth_pool]),
  ...allowErc20Approve([rETH], [contracts.mainnet.curve.oseth_reth_pool]),

  allow.mainnet.curve.oseth_reth_pool["add_liquidity(uint256[],uint256)"](),
  allow.mainnet.curve.oseth_reth_pool["remove_liquidity(uint256,uint256[])"](),
  allow.mainnet.curve.oseth_reth_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.oseth_reth_pool[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.oseth_reth_pool],
    [contracts.mainnet.curve.oseth_reth_gauge]
  ),
  allow.mainnet.curve.oseth_reth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.oseth_reth_gauge["withdraw(uint256)"](),
  allow.mainnet.curve.oseth_reth_gauge["withdraw(uint256,bool)"](),
  allow.mainnet.curve.oseth_reth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.oseth_reth_gauge),

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

  // Nexus Mutual
  // Deposit ETH in exchange for NXM; redeem NXM in exchange for ETH
  allow.mainnet.nexus.ramm.swap(undefined, undefined, undefined, {
    send: true,
  }),
  ...allowErc20Approve([NXM], [contracts.mainnet.nexus.wNXM]),
  // Wrap NXM
  allow.mainnet.nexus.wNXM.wrap(),
  // Unwrap WNXM
  allow.mainnet.nexus.wNXM.unwrap(),
  // Claim NXM rewards
  allow.mainnet.nexus.token_controller.withdrawNXM(),
  // Approval of NXM with the TokenController as spender was already included
  // TokenController manages the approvals for all pools
  ...allowErc20Approve([NXM], [contracts.mainnet.nexus.token_controller]),
  // Allows users to deposit NXM into the pool, creating stake and rewards shares in return
  // Supports deposits to specific tranches and allows reusing the same nft for deposits in multiple tranches to an existing deposit
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.staking_pool.depositTo(
      undefined,
      undefined,
      undefined,
      ZERO_ADDRESS
    ),
    targetAddress: pool,
  })),
  // Extends the duration of a deposit by moving it from an tranche to a future tranche
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.staking_pool.extendDeposit(),
    targetAddress: pool,
  })),
  // Allows users to withdraw their stake and/or rewards from specific tranches
  // Withdrawing the stakes can be done only on expired tranches
  ...nexus.pools.map((pool) => ({
    ...allow.mainnet.nexus.staking_pool.withdraw(),
    targetAddress: pool,
  })),

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

  // SWAPS
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
    [contracts.mainnet.uniswap_v3.router_2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, AURA, BAL, CRV, CVX, DAI, GHO, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, WNXM, wstETH
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
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
