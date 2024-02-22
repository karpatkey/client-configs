import { c, Permission } from "zodiac-roles-sdk";
import { allow } from "zodiac-roles-sdk/kit";
import { allow as allowAction } from "defi-kit/eth";
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
  spWETH,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
  wstETH,
} from "../../../../eth-sdk/addresses";
import { contracts } from "../../../../eth-sdk/config";
import { allowErc20Approve } from "../../../../utils/erc20";
import { avatar } from "../../index";


export default [
  // Use defi-kit to generate the permissions...
  // Ankr
  ...await allowAction.ankr.deposit(),

  // Aura - wstETH/WETH
  ...await allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  ...await allowAction.aura.deposit({ targets: ["109"] }),

  // Balancer - wstETH/WETH
  ...await allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  ...await allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  ...await allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  ...await allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),

  // // Compound v3 - cUSDCv3 - USDC
  // ...allowAction.compound_v3.deposit({
  //   targets: ["cUSDCv3"],
  //   tokens: ["USDC"],
  // }),
  // // Compound v3 - cWETHv3 - ETH
  // ...allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["ETH"] }),

  // Convex - ETH/stETH
  ...await allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - cDAI/cUSDC
  ...await allowAction.convex.deposit({ targets: ["0"] }),

  // Lido
  ...await allowAction.lido.deposit(),

  // Rocket Pool
  ...await allowAction.rocket_pool.deposit(),

  // Stader
  ...await allowAction.stader.deposit(),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave v3 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, avatar),

  // Aave v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Aave v3 - ETH
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.depositETH(
    contracts.mainnet.aave_v3.pool_v3,
    avatar,
    undefined,
    { send: true },
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_v3,
    avatar,
    undefined,
  ),

  // Aave v3 - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Compound v2 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cDAI]),
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - Claim COMP
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    avatar,
    c.subset([
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ]),
  ),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - ETH
  allow.mainnet.compound_v3.cWETHv3.allow(contracts.mainnet.compound_v3.MainnetBulker),
  allow.mainnet.compound_v3.MainnetBulker.invoke(
    c.or(
      c.eq("0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000"), // ACTION_SUPPLY_NATIVE_TOKEN)
      c.eq("0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000"), // ACTION_WITHDRAW_NATIVE_TOKEN
    ),
    c.abiEncodedMatches(
      [
        contracts.mainnet.compound_v3.cWETHv3,
        c.avatar,
      ],
      ["address", "address", "address", "uint256"]
    ),
    { send:true }
  ),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    c.or(
      c.eq(contracts.mainnet.compound_v3.cWETHv3),
      c.eq(contracts.mainnet.compound_v3.cUSDCv3),
    ),
    c.avatar
  ),

  // Curve - ETH/stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.add_liquidity(undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_one_coin(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_imbalance(),
  ...allowErc20Approve(
    [contracts.mainnet.curve.steCRV],
    [contracts.mainnet.curve.steth_eth_gauge],
  ),
  allow.mainnet.curve.steth_eth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.steth_eth_gauge.withdraw(),
  allow.mainnet.curve.steth_eth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.steth_eth_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.steth_eth_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap,
  ),

  // Curve - cDAI/cUSDC
  ...allowErc20Approve(
    [
      DAI,
      USDC,
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ],
    [contracts.mainnet.curve.cDAIcUSDC_pool],
  ),
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.cDAIcUSDC_zap]),
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
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvcDAIcUSDC],
    [contracts.mainnet.curve.cDAIcUSDC_gauge],
  ),
  allow.mainnet.curve.cDAIcUSDC_gauge["deposit(uint256)"](),
  allow.mainnet.curve.cDAIcUSDC_gauge.withdraw(),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.cDAIcUSDC_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.cDAIcUSDC_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap,
  ),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stake_deposit_zap]),
  ...allowErc20Approve(
    [
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
      DAI,
      USDC,
    ],
    [contracts.mainnet.curve.stake_deposit_zap],
  ),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[5],uint256[5],uint256,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steth_eth_pool,
      contracts.mainnet.curve.cDAIcUSDC_pool,
      contracts.mainnet.curve.cDAIcUSDC_zap,
    ),
    c.or(contracts.mainnet.curve.steCRV, contracts.mainnet.curve.crvcDAIcUSDC),
    c.or(
      contracts.mainnet.curve.steth_eth_gauge,
      contracts.mainnet.curve.cDAIcUSDC_gauge,
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
      ],
    ),
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    {
      send: true,
    },
  ),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows 
  // service providers to deposit/withdraw dai into the DSR contract pot, 
  // and activate/deactivate the Dai Savings Rate to start earning savings 
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  ...allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
  allow.mainnet.maker.dsr_manager.join(avatar),
  allow.mainnet.maker.dsr_manager.exit(avatar),
  allow.mainnet.maker.dsr_manager.exitAll(avatar),

  // Spark - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.spark.wrappedTokenGatewayV3]),
  allow.mainnet.spark.sparkLendingPoolV3.supply(WETH, undefined, avatar),
  allow.mainnet.spark.sparkLendingPoolV3.withdraw(WETH, undefined, avatar),

  // Stakewise
  // The stake() was added manually to the abi (source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
  allow.mainnet.stakewise.eth2_staking.stake({
    send: true,
  }),
  allow.mainnet.stakewise.merkle_distributor["claim"](
    undefined,
    avatar,
    c.subset([rETH2, SWISE])
  ),

  // Spark - ETH
  ...allowErc20Approve([spWETH], [contracts.mainnet.spark.wrappedTokenGatewayV3]),
  allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    undefined,
    avatar,
  ),

  // Stakewise - Uniswap v3 ETH + sETH2, 0.3%
  ...allowErc20Approve(
    [sETH2, WETH],
    [contracts.mainnet.uniswapv3.positions_nft],
  ),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint(
    {
      token0: WETH,
      token1: sETH2,
      fee: 3000,
      recipient: avatar
    }
  ),
  // Mint NFT using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.mint(
          {
            token0: WETH,
            token1: sETH2,
            fee: 3000,
            recipient: avatar
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
          {
            tokenId: 424810
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            recipient: avatar
          }
        ),
      ),
    ]),
    { send: true },
  ),
  // Remove liquidity using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            tokenId: ZERO_ADDRESS
          }
        ),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          sETH2,
          undefined,
          avatar,
        ),
      ),
    ]),
    { send: true },
  ),
  // Collect fees using WETH
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: avatar
    }
  ),
  // Collect fees using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            recipient: ZERO_ADDRESS
          }
        ),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          sETH2,
          undefined,
          avatar,
        ),
      ),
    ]),
    { send: true },
  ),

  // SWAPS
  // Balancer - Swaps
  ...allowErc20Approve([ankrETH, AURA, BAL, COMP, ETHx, rETH, WETH, wstETH], 
    [contracts.mainnet.balancer.vault]),

  // Balancer - Swap AURA for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9000200000000000000000274",
      assetIn: AURA,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap BAL for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
      assetIn: BAL,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap WETH for DAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
      assetIn: WETH,
      assetOut: DAI,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap WETH for USDC
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019",
      assetIn: WETH,
      assetOut: USDC,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap COMP for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0xefaa1604e82e1b3af8430b90192c1b9e8197e377000200000000000000000021",
      assetIn: COMP,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap wstETH for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2", // WARNING!: 0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080
      assetIn: wstETH,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap WETH for wstETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2", // WARNING!: 0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080
      assetIn: WETH,
      assetOut: wstETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap rETH for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
      assetIn: rETH,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap WETH for rETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
      assetIn: WETH,
      assetOut: rETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap wstETH for ankrETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0xdfe6e7e18f6cc65fa13c8d8966013d4fda74b6ba000000000000000000000558",
      assetIn: wstETH,
      assetOut: ankrETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap ankrETH for wstETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0xdfe6e7e18f6cc65fa13c8d8966013d4fda74b6ba000000000000000000000558",
      assetIn: ankrETH,
      assetOut: wstETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap ETHx for WETH
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x37b18b10ce5635a84834b26095a0ae5639dcb7520000000000000000000005cb",
      assetIn: ETHx,
      assetOut: WETH,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Balancer - Swap WETH for ETHx
  allow.mainnet.balancer.vault.swap(
    {
      poolId: "0x37b18b10ce5635a84834b26095a0ae5639dcb7520000000000000000000005cb",
      assetIn: WETH,
      assetOut: ETHx,
    },
    {
      recipient: avatar,
      sender: avatar
    }
  ),

  // Cowswap - Swapping of AURA, BAL, COMP, CRV, CVX, DAI, LDO, rETH, SWISE, USDC, USDT, WETH, wstETH
  ...allowErc20Approve(
    [AURA, BAL, COMP, CRV, CVX, DAI, LDO, rETH, SWISE, USDC, USDT, WETH, wstETH], 
    [contracts.mainnet.cowswap.gpv2_vault_relayer]
  ),
  allow.mainnet.cowswap.order_signer.signOrder(
    {
      sellToken: c.or(
        AURA, 
        BAL, 
        COMP, 
        CRV, 
        CVX, 
        DAI, 
        LDO, 
        rETH, 
        SWISE, 
        USDC, 
        USDT, 
        WETH, 
        wstETH
      ),
      buyToken: c.or(
        DAI, USDC, USDT, rETH, stETH, WETH, wstETH
      ),
      receiver: avatar
    },
    undefined,
    undefined,
    {
      delegatecall: true
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
  allow.mainnet.curve.cvxETH_pool[
    "exchange(uint256,uint256,uint256,uint256)"
  ](1, 0),

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
  ...allowErc20Approve([ETHx, WETH], [contracts.mainnet.pancake_swap.smart_router]),
  allow.mainnet.pancake_swap.smart_router.exactInputSingle(
    {
      tokenIn: c.or(
        ETHx,
        WETH
      ),
      tokenOut: c.or(
        ETHx,
        WETH
      ),
      recipient: avatar
    }
  ),

  // SushiSwap old Router - Swapping of BAL, COMP, CRV, DAI, LDO, USDC, USDT, WETH
  allow.mainnet.sushiswap.router["swapExactTokensForTokens"](
    undefined,
    undefined,
    c.or(
      [COMP, WETH, USDC],
      [COMP, WETH, DAI],
      [COMP, WETH],
      [BAL, WETH, USDC],
      [BAL, WETH, DAI],
      [BAL, WETH],
      [LDO, WETH, USDC],
      [LDO, WETH, DAI],
      [LDO, WETH],
      [CRV, WETH, USDC],
      [CRV, WETH, DAI],
      [CRV, WETH],
      [WETH, USDC],
      [WETH, DAI],
      [WETH, USDT],
      [USDC, WETH],
      [USDC, WETH, USDT],
      [USDC, USDT],
      [USDC, WETH, DAI],
      [USDC, DAI],
      [USDT, WETH],
      [USDT, WETH, USDC],
      [USDT, USDC],
      [USDT, WETH, DAI],
      [USDT, DAI],
      [DAI, WETH],
      [DAI, WETH, USDC],
      [DAI, USDC],
      [DAI, WETH, USDT],
      [DAI, USDT],
    ),
    avatar
  ),
  
  // Uniswap v2 and Uniswap v3 - Swaps
  ...allowErc20Approve(
    [COMP, CRV, CVX, DAI, LDO, rETH, rETH2, sETH2, SWISE, USDC, USDT, WETH],
    [contracts.mainnet.uniswapv3.router_2]
  ),

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
      [USDT, WETH, DAI],
    ),
    avatar
  ),

  // Uniswap v3 - Swapping of tokens COMP, CRV, CVX, DAI, LDO, rETH, rETH2, sETH2, SWISE, USDC, USDT, WETH
  allow.mainnet.uniswapv3.router_2.exactInputSingle(
    {
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
        WETH,
      ),
      tokenOut: c.or(
        DAI, USDC, USDT, sETH2, WETH
      ),
      recipient: avatar
    }
  )
] satisfies Permission[];
