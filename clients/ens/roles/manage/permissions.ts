import { c, Permission } from "zodiac-roles-sdk";
import { allow } from "zodiac-roles-sdk/kit";
import { allow as allowAction } from "defi-kit/eth";
import {
  ankrETH,
  DAI,
  ETHx,
  USDC,
  rETH,
  rETH2,
  sETH2,
  spWETH,
  stETH,
  SWISE,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../eth-sdk/addresses";
import { contracts } from "../../../../eth-sdk/config";
import { allowErc20Approve } from "../../../../utils/erc20";
import { avatar } from "../../index";


export default [
  // Use defi-kit to generate the permissions...
  // Lido
  ...allowAction.lido.deposit(),

  // Compound v3 - cUSDCv3 - USDC
  ...allowAction.compound_v3.deposit({
    targets: ["cUSDCv3"],
    tokens: ["USDC"],
  }),
  // Compound v3 - cWETHv3 - ETH
  ...allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["ETH"] }),

  // AURA - wstETH/WETH
  ...allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  ...allowAction.aura.deposit({ targets: ["109"] }),

  // Balancer - wstETH/WETH
  ...allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  ...allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  ...allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  ...allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),

  // Convex - ETH/stETH
  ...allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - cDAI/cUSDC
  ...allowAction.convex.deposit({ targets: ["0"] }),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Compound v2 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cUSDC]),
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
    ]), // ASK Jan?? subset is ok or should I use c.every(c.or))
  ),

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

  // Stakewise - UniswapV3 ETH + sETH2, 0.3%
  ...allowErc20Approve(
    [sETH2, WETH],
    [contracts.mainnet.uniswapv3.positions_nft],
  ),
  // Add liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.mint(
    {
      token0: WETH,
      token1: sETH2,
      fee: 3000,
      recipient: avatar
    }
  ),
  // Add liquidity using ETH
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
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(
          {
            tokenId: 424810
          }
        ),
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

  // Rocket Pool
  // Current Deployments: https://docs.rocketpool.net/overview/contracts-integrations.html
  // IMPORTANT: https://docs.rocketpool.net/developers/usage/contracts/contracts.html
  // RocketStorage contract: 0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46
  // The central hub of the network is the RocketStorage contract, which is responsible for storing the state of the
  // entire protocol. This is implemented through the use of maps for key-value storage, and getter and setter methods for
  // reading and writing values for a key.
  // The RocketStorage contract also stores the addresses of all other network contracts (keyed by name),
  // and restricts data modification to those contracts only.
  // Because of Rocket Pool's architecture, the addresses of other contracts should not be used directly but retrieved
  // from the blockchain before use. Network upgrades may have occurred since the previous interaction, resulting in
  // outdated addresses. RocketStorage can never change address, so it is safe to store a reference to it.
  ...allowErc20Approve([rETH], [contracts.mainnet.rocket_pool.swap_router]),
  allow.mainnet.rocket_pool.deposit_pool.deposit({
    send: true,
  }),
  allow.mainnet.rocket_pool.rETH.burn(),
  // Swap ETH for rETH through SWAP_ROUTER - When there is not enough rETH in the DEPOSIT_POOL in exchange for the
  // ETH you are depositing, the SWAP_ROUTER swaps the ETH for rETH in secondary markets (Balancer and Uniswap).
  allow.mainnet.rocket_pool.swap_router.swapTo(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  // Swap rETH for ETH through SWAP_ROUTER - When there is not enough ETH in the DEPOSIT_POOL in exchange for the
  // rETH you are withdrawing, the SWAP_ROUTER swaps the rETH for ETH in secondary markets (Balancer and Uniswap).
  allow.mainnet.rocket_pool.swap_router.swapFrom(),

  // Ankr
  // Flash unstake uses a pool to swap your Liquid Staking tokens for your original assets, 
  // which means instant release of your funds.
  // While it offers instant release of your funds, it poses a few limitations:
  // 1- You have to pay a technical service fee for a flash unstake — 0.5% of the unstaked amount.
  // 2- Your unstake is limited by the current capacity of the flash-unstake pool. If you exceed it,
  // the interface switches to the standard unstake with its regular release time.
  ...allowErc20Approve([ankrETH], [contracts.mainnet.ankr.swap_pool]),
  allow.mainnet.ankr.swap_pool.swapEth(undefined, avatar),
  // Standard unstake, it may be split into several parts, but all the parts that constitute the unstaked amount will be released
  // to your account within the 6 days days period.
  allow.mainnet.ankr.ETH2_Staking.stakeAndClaimAethC({ send: true }),
  // The unstake burns the ankrETH.
  // Then once per day the distributeRewards() function is called and transfers different amounts of ETH
  // to the users on the Ethereum unstake queue, until it completes the total unstaked amount of each (within the 6 day window).
  allow.mainnet.ankr.ETH2_Staking.unstakeAETH(),

  // Stader
  ...allowErc20Approve([ETHx], [contracts.mainnet.stader.user_withdrawal_manager]),
  allow.mainnet.stader.stake_pools_manager["deposit(address)"](avatar, {
    send: true,
  }),
  // The unstaked ETH will not be immediately added to your wallet as there is an unstaking period of 7-10 days,
  // subject to entry and exit queues on the Ethereum network
  allow.mainnet.stader.user_withdrawal_manager[
    "requestWithdraw(uint256,address)"
  ](undefined, avatar),
  // All your active unstake requests will be listed in the Withdraw tab
  // Those available to be withdrawn will have an active withdraw button
  // Those unavailable to be withdrawn will have the release date and time mentioned along-with your timezone
  allow.mainnet.stader.user_withdrawal_manager.claim(),

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

  // Spark - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.spark.wrappedTokenGatewayV3]),
  allow.mainnet.spark.sparkLendingPoolV3.supply(WETH, undefined, avatar),
  allow.mainnet.spark.sparkLendingPoolV3.withdraw(WETH, undefined, avatar),

] satisfies Permission[];
