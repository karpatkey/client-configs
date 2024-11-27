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
  curve,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

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

  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit ETH
  allowAction.aave_v3.deposit({ targets: ["ETH"] }),
  // Aave v3 - Deposit osETH
  allowAction.aave_v3.deposit({ targets: ["osETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Removed as per a Steward's request on August 20, 2024.
  // // Aave v3 - Deposit wstETH
  // allowAction.aave_v3.deposit({ targets: ["wstETH"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - WETH/osETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),

  // // Compound v3 - cUSDCv3 - USDC
  // allowAction.compoundV3.deposit({
  //   targets: ["cUSDCv3"],
  //   tokens: ["USDC"],
  // }),
  // // Compound v3 - cWETHv3 - ETH
  // allowAction.compoundV3.deposit({ targets: ["cWETHv3"], tokens: ["ETH"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),

  // Convex - ETH/stETH - stETH-ng-f
  allowAction.convex.deposit({ targets: ["177"] }),

  // CowSwap - Swapping of ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH
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

  // Spark - ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),

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

  // Removed as per a Steward's request on August 20, 2024.
  // // Aave v3 - Lido Market - WETH
  // ...allowErc20Approve([WETH], [contracts.mainnet.aaveV3.lendingPoolLidoV3]),
  // allow.mainnet.aaveV3.lendingPoolLidoV3.supply(WETH, undefined, c.avatar),
  // allow.mainnet.aaveV3.lendingPoolLidoV3.withdraw(WETH, undefined, c.avatar),

  // // Aave v3 - Lido Market - wstETH
  // ...allowErc20Approve([wstETH], [contracts.mainnet.aaveV3.lendingPoolLidoV3]),
  // allow.mainnet.aaveV3.lendingPoolLidoV3.supply(wstETH, undefined, c.avatar),
  // allow.mainnet.aaveV3.lendingPoolLidoV3.withdraw(wstETH, undefined, c.avatar),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

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
        "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2",
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
        "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2",
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

  // Curve - Swap ETH <> stETH
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

  // Curve - Swap in 3pool
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.exchange(),

  // Curve - Swap CVX for ETH
  ...allowErc20Approve([CVX], [contracts.mainnet.curve.cvxEthPool]),
  allow.mainnet.curve.cvxEthPool["exchange(uint256,uint256,uint256,uint256)"](
    1,
    0
  ),

  // Curve - Swap ankrETH <> ETH
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

  // PancakeSwap - Swap ETHx <> WETH
  ...allowErc20Approve(
    [ETHx, WETH],
    [contracts.mainnet.pancakeSwap.smartRouter]
  ),
  allow.mainnet.pancakeSwap.smartRouter.exactInputSingle({
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
    [contracts.mainnet.uniswapV3.router2]
  ),

  // Uniswap v3 - Swapping of tokens ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH
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
] satisfies PermissionList
