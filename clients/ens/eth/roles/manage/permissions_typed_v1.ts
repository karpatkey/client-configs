import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
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
  rETH,
  rETH2,
  sETH2,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
  wstETH,
  aura,
  balancer,
  curve,
  convex
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
  * Typed-presets permissions
  *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave v3 - DAI
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),

  // Aave v3 - ETH
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.depositETH(
    contracts.mainnet.aave_v3.pool_v3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_v3,
    undefined,
    c.avatar
  ),

  // Aave v3 - USDC
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),

  // Aave v3 - WETH
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),

  // Ankr
  allow.mainnet.ankr.ETH2_Staking.stakeAndClaimAethC({ send: true }),
  allow.mainnet.ankr.flashUnstake.swapEth(undefined, c.avatar),
  allow.mainnet.ankr.ETH2_Staking.unstakeAETH(),

  // Aura - wstETH/WETH
  allow.mainnet.aura.booster.deposit(153),
  allow.mainnet.aura.reward_deposit_wrapper.depositSingle(
    aura.auraB_stETH_stable_rewarder,
    c.or(wstETH, WETH),
    undefined,
    balancer.B_stETH_stable_pid
  ),
  {
    ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    targetAddress: aura.auraB_stETH_stable_rewarder
  },
  {
    ...allow.mainnet.aura.rewarder["getReward()"](),
    targetAddress: aura.auraB_stETH_stable_rewarder
  },
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](
      c.avatar
    ),
    targetAddress: aura.auraB_stETH_stable_rewarder
  },

  // Aura - rETH/WETH
  allow.mainnet.aura.booster.deposit(109),
  allow.mainnet.aura.reward_deposit_wrapper.depositSingle(
    aura.auraB_rETH_stable_rewarder,
    c.or(rETH, WETH),
    undefined,
    balancer.B_rETH_stable_pid
  ),
  {
    ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    targetAddress: aura.auraB_rETH_stable_rewarder
  },
  {
    ...allow.mainnet.aura.rewarder["getReward()"](),
    targetAddress: aura.auraB_rETH_stable_rewarder
  },
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](
      c.avatar
    ),
    targetAddress: aura.auraB_rETH_stable_rewarder
  },

  // Balancer - wstETH/WETH
  allow.mainnet.balancer.vault.joinPool(
    balancer.B_stETH_stable_pid,
    c.avatar,
    c.avatar
  ),
  allow.mainnet.balancer.vault.exitPool(
    balancer.B_stETH_stable_pid,
    c.avatar,
    c.avatar
  ),
  {
    ...allow.mainnet.balancer.gauge["deposit(uint256)"](),
    targetAddress: balancer.B_stETH_stable_gauge
  },
  {
    ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
    targetAddress: balancer.B_stETH_stable_gauge
  },
  {
    ...allow.mainnet.balancer.gauge["claim_rewards()"](),
    targetAddress: balancer.B_stETH_stable_gauge
  },
  allow.mainnet.balancer.BAL_minter.mint(
    balancer.B_stETH_stable_gauge
  ),

  // Balancer - rETH/WETH
  allow.mainnet.balancer.vault.joinPool(
    balancer.B_rETH_stable_pid,
    c.avatar,
    c.avatar
  ),
  allow.mainnet.balancer.vault.exitPool(
    balancer.B_rETH_stable_pid,
    c.avatar,
    c.avatar
  ),
  {
    ...allow.mainnet.balancer.gauge["deposit(uint256)"](),
    targetAddress: balancer.B_rETH_stable_gauge
  },
  {
    ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
    targetAddress: balancer.B_rETH_stable_gauge
  },
  {
    ...allow.mainnet.balancer.gauge["claim_rewards()"](),
    targetAddress: balancer.B_rETH_stable_gauge
  },
  allow.mainnet.balancer.BAL_minter.mint(
    balancer.B_rETH_stable_gauge
  ),

  // Compound v2 - DAI
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - USDC
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - Claim COMP
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    c.avatar
  ),

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
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    undefined,
    c.avatar
  ),

  // Convex - ETH/stETH
  allow.mainnet.convex.booster.deposit(25),
  allow.mainnet.convex.booster.depositAll(25),
  allow.mainnet.convex.booster.withdraw(25),
  {
    ...allow.mainnet.convex.rewarder.stake(),
    targetAddress: convex.cvxsteCRV_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder.withdraw(),
    targetAddress: convex.cvxsteCRV_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
    targetAddress: convex.cvxsteCRV_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.cvxsteCRV_rewarder,
  },

  // Convex - cDAI/cUSDC
  allow.mainnet.convex.booster.deposit("0"),
  allow.mainnet.convex.booster.depositAll("0"),
  allow.mainnet.convex.booster.withdraw("0"),
  {
    ...allow.mainnet.convex.rewarder.stake(),
    targetAddress: convex.cvxcDAIcUSDC_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder.withdraw(),
    targetAddress: convex.cvxcDAIcUSDC_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
    targetAddress: convex.cvxcDAIcUSDC_rewarder
  },
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.cvxcDAIcUSDC_rewarder,
  },

  // Curve - ETH/stETH
  allow.mainnet.curve.steth_eth_pool.add_liquidity(undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_one_coin(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_imbalance(),
  allow.mainnet.curve.steth_eth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.steth_eth_gauge.withdraw(),
  allow.mainnet.curve.steth_eth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.steth_eth_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.steth_eth_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap
  ),

  // Curve - cDAI/cUSDC
  allow.mainnet.curve.cDAIcUSDC_pool.add_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_zap.add_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_pool.remove_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_zap.remove_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_pool.remove_liquidity_imbalance(),
  allow.mainnet.curve.cDAIcUSDC_zap.remove_liquidity_imbalance(),
  allow.mainnet.curve.cDAIcUSDC_zap[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.cDAIcUSDC_pool.exchange(),
  allow.mainnet.curve.cDAIcUSDC_pool.exchange_underlying(),
  allow.mainnet.curve.cDAIcUSDC_gauge["deposit(uint256)"](),
  allow.mainnet.curve.cDAIcUSDC_gauge.withdraw(),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.cDAIcUSDC_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.cDAIcUSDC_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap
  ),

  // Curve - Deposit and Stake using a special ZAP
  allow.mainnet.curve.stake_deposit_zap_v1[
    "deposit_and_stake(address,address,address,uint256,address[5],uint256[5],uint256,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steth_eth_pool,
      contracts.mainnet.curve.cDAIcUSDC_pool,
      contracts.mainnet.curve.cDAIcUSDC_zap
    ),
    c.or(curve.steCRV, curve.crvcDAIcUSDC),
    c.or(
      contracts.mainnet.curve.steth_eth_gauge,
      contracts.mainnet.curve.cDAIcUSDC_gauge
    ),
    2,
    c.or(
      [E_ADDRESS, stETH, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
      [DAI, USDC, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
      [
        contracts.mainnet.compound_v2.cUSDC,
        contracts.mainnet.compound_v2.cDAI,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
      ]
    ),
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    { send: true }
  ),

  // Lido
  allow.mainnet.lido.stETH.submit(
    undefined,
    { send: true }
  ),
  allow.mainnet.lido.wstETH.wrap(),
  allow.mainnet.lido.wstETH.unwrap(),
  allow.mainnet.lido.unstETH.requestWithdrawals(
    undefined,
    c.avatar
  ),
  allow.mainnet.lido.unstETH.requestWithdrawalsWstETH(
    undefined,
    c.avatar
  ),
  allow.mainnet.lido.unstETH.claimWithdrawals(),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  allow.mainnet.maker.dsr_manager.join(c.avatar),
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Rocket Pool
  allow.mainnet.rocket_pool.deposit_pool.deposit(
    { send: true }
  ), // WARNING!: In the DK, the Deposit Pool is replaced dynamically when the preset is being created.
  allow.mainnet.rocket_pool.rETH.burn(),
  {
    ...allow.mainnet.rocket_pool.swap_router.swapTo(),
    send: true,
  },
  allow.mainnet.rocket_pool.swap_router.swapFrom(),

  // Spark - WETH
  allow.mainnet.spark.sparkLendingPoolV3.supply(WETH, undefined, c.avatar),
  allow.mainnet.spark.sparkLendingPoolV3.withdraw(WETH, undefined, c.avatar),

  // Spark - ETH
  allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    undefined,
    c.avatar
  ),

  // Stader
  allow.mainnet.stader.staking_pool_manager["deposit(address)"](
    c.avatar,
    { send: true }
  ),
  allow.mainnet.stader.user_withdraw_manager[
    "requestWithdraw(uint256,address)"
  ](undefined, c.avatar),
  allow.mainnet.stader.user_withdraw_manager.claim(),

  // StakeWise
  // The stake() was added manually to the abi (source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
  allow.mainnet.stakewise.eth2_staking.stake({
    send: true,
  }),
  allow.mainnet.stakewise.merkle_distributor["claim"](
    undefined,
    c.avatar
  ),

  // StakeWise - Uniswap v3 ETH + sETH2, 0.3%
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WETH,
    token1: sETH2,
    fee: 3000,
    recipient: c.avatar,
  }),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
    {
      tokenId: 424810,
    },
  ),
  allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: c.avatar,
    }
  ),

  // SWAPS
  // Balancer - Swaps
  // Balancer - Swap AURA for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9000200000000000000000274",
      assetIn: AURA,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap BAL for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
      assetIn: BAL,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for DAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
      assetIn: WETH,
      assetOut: DAI,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for USDC
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019",
      assetIn: WETH,
      assetOut: USDC,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap COMP for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xefaa1604e82e1b3af8430b90192c1b9e8197e377000200000000000000000021",
      assetIn: COMP,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap wstETH for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
      assetIn: wstETH,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for wstETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
      assetIn: WETH,
      assetOut: wstETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap rETH for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
      assetIn: rETH,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for rETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
      assetIn: WETH,
      assetOut: rETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap wstETH for ankrETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xdfe6e7e18f6cc65fa13c8d8966013d4fda74b6ba000000000000000000000558",
      assetIn: wstETH,
      assetOut: ankrETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap ankrETH for wstETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0xdfe6e7e18f6cc65fa13c8d8966013d4fda74b6ba000000000000000000000558",
      assetIn: ankrETH,
      assetOut: wstETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap ETHx for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x37b18b10ce5635a84834b26095a0ae5639dcb7520000000000000000000005cb",
      assetIn: ETHx,
      assetOut: WETH,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Balancer - Swap WETH for ETHx
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x37b18b10ce5635a84834b26095a0ae5639dcb7520000000000000000000005cb",
      assetIn: WETH,
      assetOut: ETHx,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Curve - Swap ETH <> stETH
  allow.mainnet.curve.steth_eth_pool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - Swap in 3pool
  allow.mainnet.curve.x3CRV_pool.exchange(),

  // Curve - Swap CVX for ETH
  allow.mainnet.curve.cvxETH_pool["exchange(uint256,uint256,uint256,uint256)"](
    1,
    0
  ),

  // Curve - Swap ankrETH <> ETH
  allow.mainnet.curve.ankrETH_pool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // PancakeSwap - Swap ETHx <> WETH
  allow.mainnet.pancake_swap.smart_router.exactInputSingle({
    tokenIn: c.or(ETHx, WETH),
    tokenOut: c.or(ETHx, WETH),
    recipient: c.avatar,
  }),

  // Uniswap v2 and Uniswap v3 - Swaps
  // Uniswap v2 - Swapping of tokens COMP, CRV, DAI, LDO, USDC, USDT, WETH
  allow.mainnet.uniswapv3.router_2.swapExactTokensForTokens(
    undefined,
    undefined,
    c.or(
      [COMP, WETH, USDC],
      [COMP, WETH, DAI],
      [COMP, WETH],
      [CRV, WETH, USDC],
      [CRV, WETH, DAI],
      [CRV, WETH],
      [LDO, WETH, USDC],
      [LDO, WETH, DAI],
      [LDO, WETH],
      [WETH, USDC],
      [WETH, DAI],
      [WETH, USDT],
      [USDC, WETH],
      [USDC, USDT],
      [USDC, WETH, USDT],
      [USDC, DAI],
      [USDC, WETH, DAI],
      [DAI, WETH],
      [DAI, USDC],
      [DAI, WETH, USDC],
      [DAI, USDT],
      [DAI, WETH, USDT],
      [USDT, WETH],
      [USDT, USDC],
      [USDT, WETH, USDC],
      [USDT, DAI],
      [USDT, WETH, DAI]
    ),
    c.avatar
  ),

  // Uniswap v3 - Swapping of tokens COMP, CRV, CVX, DAI, LDO, rETH, rETH2, sETH2, SWISE, USDC, USDT, WETH
  allow.mainnet.uniswapv3.router_2.exactInputSingle({
    tokenIn: c.or(
      COMP,
      CRV,
      CVX,
      DAI,
      LDO,
      rETH,
      rETH2,
      sETH2,
      SWISE,
      USDC,
      USDT,
      WETH
    ),
    tokenOut: c.or(DAI, USDC, USDT, sETH2, WETH),
    recipient: c.avatar,
  }),
] satisfies PermissionList