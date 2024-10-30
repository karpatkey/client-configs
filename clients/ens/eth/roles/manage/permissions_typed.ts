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
  spWETH,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
  wstETH,
  aave_v3,
  aura,
  balancer,
  curve,
  convex,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
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
  ...allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),

  // Aave v3 - ETH
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.depositETH(
    contracts.mainnet.aave_v3.pool_v3,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [aave_v3.aEthWETH],
    [contracts.mainnet.aave_v3.wrapped_token_gateway_v3]
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_v3,
    undefined,
    c.avatar
  ),

  // Aave v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),

  // Aave v3 - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(WETH, undefined, c.avatar),
  // Approval already included for ETH, though UNNECESSARY. UI error to request this approval.
  // ...allowErc20Approve([aave_v3.aEthWETH], [contracts.mainnet.aave_v3.wrapped_token_gateway_v3])
  allow.mainnet.aave_v3.pool_v3.withdraw(WETH, undefined, c.avatar),

  // Ankr
  ...allowErc20Approve([ankrETH], [contracts.mainnet.ankr.flashUnstake]),
  allow.mainnet.ankr.ETH2_Staking.stakeAndClaimAethC({ send: true }),
  allow.mainnet.ankr.flashUnstake.swapEth(undefined, c.avatar),
  allow.mainnet.ankr.ETH2_Staking.unstakeAETH(),

  // Aura - wstETH/WETH
  ...allowErc20Approve(
    [wstETH, WETH],
    [contracts.mainnet.aura.reward_deposit_wrapper]
  ),
  ...allowErc20Approve(
    [balancer.B_stETH_stable],
    [contracts.mainnet.aura.booster]
  ),
  allow.mainnet.aura.booster.deposit(153),
  allow.mainnet.aura.reward_deposit_wrapper.depositSingle(
    aura.auraB_stETH_stable_rewarder,
    c.or(wstETH, WETH),
    undefined,
    balancer.B_stETH_stable_pid
  ),
  {
    ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    targetAddress: aura.auraB_stETH_stable_rewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward()"](),
    targetAddress: aura.auraB_stETH_stable_rewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: aura.auraB_stETH_stable_rewarder,
  },

  // Aura - rETH/WETH
  ...allowErc20Approve(
    [rETH, WETH],
    [contracts.mainnet.aura.reward_deposit_wrapper]
  ),
  ...allowErc20Approve(
    [balancer.B_rETH_stable],
    [contracts.mainnet.aura.booster]
  ),
  allow.mainnet.aura.booster.deposit(109),
  allow.mainnet.aura.reward_deposit_wrapper.depositSingle(
    aura.auraB_rETH_stable_rewarder,
    c.or(rETH, WETH),
    undefined,
    balancer.B_rETH_stable_pid
  ),
  {
    ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    targetAddress: aura.auraB_rETH_stable_rewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward()"](),
    targetAddress: aura.auraB_rETH_stable_rewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: aura.auraB_rETH_stable_rewarder,
  },

  // Balancer - wstETH/WETH
  ...allowErc20Approve([wstETH, WETH], [contracts.mainnet.balancer.vault]),
  ...allowErc20Approve(
    [balancer.B_stETH_stable],
    [balancer.B_stETH_stable_gauge]
  ),
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
    targetAddress: balancer.B_stETH_stable_gauge,
  },
  {
    ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
    targetAddress: balancer.B_stETH_stable_gauge,
  },
  {
    ...allow.mainnet.balancer.gauge["claim_rewards()"](),
    targetAddress: balancer.B_stETH_stable_gauge,
  },
  allow.mainnet.balancer.BAL_minter.mint(balancer.B_stETH_stable_gauge),

  // Balancer - rETH/WETH
  ...allowErc20Approve([rETH, WETH], [contracts.mainnet.balancer.vault]),
  ...allowErc20Approve(
    [balancer.B_rETH_stable],
    [balancer.B_rETH_stable_gauge]
  ),
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
    targetAddress: balancer.B_rETH_stable_gauge,
  },
  {
    ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
    targetAddress: balancer.B_rETH_stable_gauge,
  },
  {
    ...allow.mainnet.balancer.gauge["claim_rewards()"](),
    targetAddress: balancer.B_rETH_stable_gauge,
  },
  allow.mainnet.balancer.BAL_minter.mint(balancer.B_rETH_stable_gauge),

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

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Convex - ETH/stETH - steCRV
  ...allowErc20Approve([curve.steCRV], [contracts.mainnet.convex.booster]),
  ...allowErc20Approve([convex.steCRV], [convex.steCRV_rewarder]),
  allow.mainnet.convex.booster.deposit(25),
  allow.mainnet.convex.booster.depositAll(25),
  allow.mainnet.convex.booster.withdraw(25),
  {
    ...allow.mainnet.convex.rewarder.stake(),
    targetAddress: convex.steCRV_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder.withdraw(),
    targetAddress: convex.steCRV_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
    targetAddress: convex.steCRV_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.steCRV_rewarder,
  },

  // Convex - ETH/stETH - stETH-ng-f
  ...allowErc20Approve(
    [contracts.mainnet.curve.stETH_ng_f_pool],
    [contracts.mainnet.convex.booster]
  ),
  ...allowErc20Approve([convex.stETH_ng_f], [convex.stETH_ng_f_rewarder]),
  allow.mainnet.convex.booster.deposit(177),
  allow.mainnet.convex.booster.depositAll(177),
  allow.mainnet.convex.booster.withdraw(177),
  {
    ...allow.mainnet.convex.rewarder.stake(),
    targetAddress: convex.stETH_ng_f_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder.withdraw(),
    targetAddress: convex.stETH_ng_f_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
    targetAddress: convex.stETH_ng_f_rewarder,
  },
  {
    ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: convex.stETH_ng_f_rewarder,
  },

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

  // Curve - ETH/stETH - stETH-ng-f
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stETH_ng_f_pool]),
  allow.mainnet.curve.stETH_ng_f_pool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    { send: true }
  ),
  allow.mainnet.curve.stETH_ng_f_pool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.stETH_ng_f_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.stETH_ng_f_pool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.stETH_ng_f_pool],
    [contracts.mainnet.curve.stETH_ng_f_gauge]
  ),
  allow.mainnet.curve.stETH_ng_f_gauge["deposit(uint256)"](),
  allow.mainnet.curve.stETH_ng_f_gauge["withdraw(uint256)"](),
  allow.mainnet.curve.stETH_ng_f_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.stETH_ng_f_gauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stake_deposit_zap]),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steth_eth_pool,
      contracts.mainnet.curve.stETH_ng_f_pool
    ),
    c.or(curve.steCRV, contracts.mainnet.curve.stETH_ng_f_pool),
    c.or(
      contracts.mainnet.curve.steth_eth_gauge,
      contracts.mainnet.curve.stETH_ng_f_gauge
    ),
    2,
    [E_ADDRESS, stETH, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
    undefined,
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    { send: true }
  ),

  // Lido
  ...allowErc20Approve([stETH], [wstETH]),
  ...allowErc20Approve([stETH, wstETH], [contracts.mainnet.lido.unstETH]),
  allow.mainnet.lido.stETH.submit(undefined, { send: true }),
  allow.mainnet.lido.wstETH.wrap(),
  allow.mainnet.lido.wstETH.unwrap(),
  allow.mainnet.lido.unstETH.requestWithdrawals(undefined, c.avatar),
  allow.mainnet.lido.unstETH.requestWithdrawalsWithPermit(undefined, c.avatar),
  allow.mainnet.lido.unstETH.requestWithdrawalsWstETH(undefined, c.avatar),
  allow.mainnet.lido.unstETH.requestWithdrawalsWstETHWithPermit(
    undefined,
    c.avatar
  ),
  allow.mainnet.lido.unstETH.claimWithdrawal(),
  allow.mainnet.lido.unstETH.claimWithdrawals(),

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

  // Rocket Pool
  ...allowErc20Approve(
    [contracts.mainnet.rocket_pool.rETH],
    [contracts.mainnet.rocket_pool.swap_router]
  ),
  allow.mainnet.rocket_pool.deposit_pool.deposit({ send: true }), // WARNING!: In the DK, the Deposit Pool is replaced dynamically when the preset is being created.
  allow.mainnet.rocket_pool.rETH.burn(),
  {
    ...allow.mainnet.rocket_pool.swap_router.swapTo(),
    send: true,
  },
  allow.mainnet.rocket_pool.swap_router.swapFrom(),

  // Spark - ETH
  allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [spWETH],
    [contracts.mainnet.spark.wrappedTokenGatewayV3]
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    undefined,
    c.avatar
  ),

  // Spark - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.spark.sparkLendingPoolV3]),
  allow.mainnet.spark.sparkLendingPoolV3.supply(WETH, undefined, c.avatar),
  allow.mainnet.spark.sparkLendingPoolV3.withdraw(WETH, undefined, c.avatar),

  // Stader
  ...allowErc20Approve(
    [ETHx],
    [contracts.mainnet.stader.user_withdraw_manager]
  ),
  allow.mainnet.stader.staking_pool_manager["deposit(address)"](c.avatar, {
    send: true,
  }),
  allow.mainnet.stader.staking_pool_manager["deposit(address,string)"](
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.stader.user_withdraw_manager[
    "requestWithdraw(uint256,address)"
  ](undefined, c.avatar),
  allow.mainnet.stader.user_withdraw_manager.claim(),

  // SWAPS
  // Balancer - Swaps
  ...allowErc20Approve(
    [ankrETH, AURA, BAL, COMP, ETHx, rETH, WETH, wstETH],
    [contracts.mainnet.balancer.vault]
  ),

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
        "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2", // WARNING!: 0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080
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
        "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2", // WARNING!: 0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080
      assetIn: WETH,
      assetOut: wstETH,
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
        "0xf01b0684c98cd7ada480bfdf6e43876422fa1fc10002000000000000000005de",
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
        "0xf01b0684c98cd7ada480bfdf6e43876422fa1fc10002000000000000000005de",
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

  // Cowswap - Swapping of ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, rETH, stETH, SWISE, USDC, USDT, WETH, wstETH
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
      rETH,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.cowswap.gpv2_vault_relayer]
  ),
  allow.mainnet.cowswap.order_signer.signOrder(
    {
      sellToken: c.or(
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
        stETH,
        SWISE,
        USDC,
        USDT,
        WETH,
        wstETH
      ),
      buyToken: c.or(DAI, rETH, USDC, USDT, stETH, WETH, wstETH),
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),

  // Curve - Swap ETH <> stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
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
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool.exchange(),

  // Curve - Swap CVX for ETH
  ...allowErc20Approve([CVX], [contracts.mainnet.curve.cvxETH_pool]),
  allow.mainnet.curve.cvxETH_pool["exchange(uint256,uint256,uint256,uint256)"](
    1,
    0
  ),

  // Curve - Swap ankrETH <> ETH
  ...allowErc20Approve([ankrETH], [contracts.mainnet.curve.ankrETH_pool]),
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
  ...allowErc20Approve(
    [ETHx, WETH],
    [contracts.mainnet.pancake_swap.smart_router]
  ),
  allow.mainnet.pancake_swap.smart_router.exactInputSingle({
    tokenIn: c.or(ETHx, WETH),
    tokenOut: c.or(ETHx, WETH),
    recipient: c.avatar,
  }),

  // Uniswap v3 - Swaps
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
      rETH,
      stETH,
      SWISE,
      USDC,
      USDT,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.uniswap_v3.router_2]
  ),

  // Uniswap v3 - Swapping of tokens ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, rETH, stETH, SWISE, USDC, USDT, WETH, wstETH
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
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
      rETH,
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
] satisfies PermissionList
