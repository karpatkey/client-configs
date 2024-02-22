import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  COMP,
  DAI,
  rETH,
  rETH2,
  sETH2,
  stETH,
  SWISE,
  USDC,
  USDT,
  WBTC,
  WETH,
  wstETH,
  ZERO_ADDRESS,
} from "../../../../eth-sdk/addresses"
import { contracts } from "../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../utils/erc20"
import { avatar } from "../../index"
import { PermissionList } from "../../../../types"

// governance.karpatkey.eth
const GOVERNANCE_KPK = "0x8787FC2De4De95c53e5E3a4e5459247D9773ea52"

export default [
  // Use defi-kit to generate the permissions...
  // Lido
  allowAction.lido.deposit(),

  // Aave v2 - Staking of AAVE in Safety Module
  allowAction.aave_v2.stake({ targets: ["AAVE"] }),

  // // Compound v3 - cUSDCv3 - USDC
  // allowAction.compound_v3.deposit({
  //   targets: ["cUSDCv3"],
  //   tokens: ["USDC"],
  // }),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave - Delegate Aave and stkAave to governance.karpatkey.eth
  allow.mainnet.aave_v2.aave.delegate(GOVERNANCE_KPK),
  allow.mainnet.aave_v2.stkAave.delegate(GOVERNANCE_KPK),

  // Aave v3 - DAI
  allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, avatar),

  // Aave v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Compound v2 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - DAI
  allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cDAI]),
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - AAVE
  allowErc20Approve([AAVE], [contracts.mainnet.compound_v2.cAAVE]),
  allow.mainnet.compound_v2.cAAVE.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cAAVE.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cAAVE.redeemUnderlying(),

  // Compound v2 - Claim COMP
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    avatar,
    c.subset([
      contracts.mainnet.compound_v2.cAAVE,
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ])
  ),

  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    contracts.mainnet.compound_v3.cUSDCv3,
    c.avatar
  ),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  allowErc20Approve([WBTC, WETH], [contracts.mainnet.uniswapv3.positions_nft]),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WBTC,
    token1: WETH,
    fee: 3000,
    recipient: avatar,
  }),
  // Mint NFT using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.mint({
          token0: WBTC,
          token1: WETH,
          fee: 3000,
          recipient: avatar,
        })
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true }
  ),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.increaseLiquidity({
          tokenId: 430246,
        })
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true }
  ),
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity()
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect({
          recipient: avatar,
        })
      ),
    ]),
    { send: true }
  ),
  // Remove liquidity using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity()
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect({
          tokenId: ZERO_ADDRESS,
        })
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar)
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          WBTC,
          undefined,
          avatar
        )
      ),
    ]),
    { send: true }
  ),
  // Collect fees using WETH
  allow.mainnet.uniswapv3.positions_nft.collect({
    recipient: avatar,
  }),
  // Collect fees using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect({
          recipient: ZERO_ADDRESS,
        })
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar)
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          WBTC,
          undefined,
          avatar
        )
      ),
    ]),
    { send: true }
  ),

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

  // Stakewise - Uniswap v3 ETH + sETH2, 0.3% - WETH already approved
  allowErc20Approve([sETH2], [contracts.mainnet.uniswapv3.positions_nft]),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WETH,
    token1: sETH2,
    fee: 3000,
    recipient: avatar,
  }),
  // Mint NFT using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.mint({
          token0: WETH,
          token1: sETH2,
          fee: 3000,
          recipient: avatar,
        })
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true }
  ),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.increaseLiquidity({
          tokenId: 418686,
        })
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true }
  ),
  // The decreaseLiquidity and collect functions have already been whitelisted.

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
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
  allowErc20Approve([rETH], [contracts.mainnet.rocket_pool.swap_router]),
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

  // Uniswap v2 and Uniswap v3 - Swaps
  allowErc20Approve(
    [AAVE, COMP, DAI, rETH, rETH2, sETH2, SWISE, USDC, USDT, WBTC, WETH],
    [contracts.mainnet.uniswapv3.router_2]
  ),

  // Uniswap v2 - Swapping of tokens AAVE, COMP, DAI, rETH2, sETH2, SWISE, USDC, USDT, WBTC, WETH
  allow.mainnet.uniswapv3.router_2.swapExactTokensForTokens(
    undefined,
    undefined,
    c.or(
      [COMP, WETH, USDC],
      [COMP, WETH, DAI],
      [COMP, WETH],
      [AAVE, WETH, USDC],
      [AAVE, WETH, DAI],
      [AAVE, WETH],
      [rETH2, sETH2, WETH, USDC],
      [rETH2, sETH2, WETH, DAI],
      [rETH2, sETH2, WETH],
      [SWISE, sETH2, WETH, USDC],
      [SWISE, sETH2, WETH, DAI],
      [SWISE, sETH2, WETH],
      [sETH2, WETH],
      [WETH, sETH2],
      [WETH, DAI],
      [WETH, USDC],
      [WETH, USDT],
      [WETH, WBTC],
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
      [WBTC, WETH]
    ),
    avatar
  ),

  // Uniswap v3 - Swapping of tokens AAVE, COMP, DAI, rETH, rETH2, sETH2, SWISE, USDC, USDT, WBTC, WETH
  allow.mainnet.uniswapv3.router_2.exactInputSingle({
    tokenIn: c.or(
      AAVE,
      COMP,
      DAI,
      rETH,
      rETH2,
      sETH2,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH
    ),
    tokenOut: c.or(DAI, sETH2, USDC, USDT, WBTC, WETH),
    recipient: avatar,
  }),

  // Balancer - Swaps
  allowErc20Approve(
    [COMP, rETH, WETH, wstETH],
    [contracts.mainnet.balancer.vault]
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
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
      recipient: avatar,
      sender: avatar,
    }
  ),

  // SushiSwap - Swapping of tokens COMP, DAI, USDC, USDT, WETH
  allowErc20Approve(
    [COMP, DAI, USDC, USDT, WETH],
    [contracts.mainnet.sushiswap.route_processor_3_2]
  ),
  // WARNING!: we are not scopping the route (reason why we removed it from ENS)
  allow.mainnet.sushiswap.route_processor_3_2.processRoute(
    c.or(COMP, DAI, USDC, USDT, WETH),
    undefined,
    c.or(DAI, USDC, USDT, WETH),
    undefined,
    avatar
  ),

  // Curve - Swap ETH <> stETH
  allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.exchange(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Cowswap - Swapping of AAVE, COMP, DAI, rETH, rETH2, sETH2, stETH, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allowErc20Approve(
    [
      AAVE,
      COMP,
      DAI,
      rETH,
      rETH2,
      sETH2,
      stETH,
      SWISE,
      USDC,
      USDT,
      WBTC,
      WETH,
      wstETH,
    ],
    [contracts.mainnet.cowswap.gpv2_vault_relayer]
  ),
  allow.mainnet.cowswap.order_signer.signOrder(
    {
      sellToken: c.or(
        AAVE,
        COMP,
        DAI,
        rETH,
        rETH2,
        sETH2,
        stETH,
        SWISE,
        USDC,
        USDT,
        WBTC,
        WETH,
        wstETH
      ),
      buyToken: c.or(DAI, rETH, sETH2, stETH, USDC, USDT, WBTC, WETH, wstETH),
      receiver: avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),
] satisfies PermissionList
