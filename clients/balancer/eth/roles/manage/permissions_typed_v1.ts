import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
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
  WETH,
  wstETH
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { PermissionList } from "../../../../../types"

// governance.karpatkey.eth
const GOVERNANCE_KPK = "0x8787FC2De4De95c53e5E3a4e5459247D9773ea52"

export default [
  /*********************************************
  * Typed-presets permissions
  *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave v2 - Staking of AAVE in Safety Module
  allow.mainnet.aave_v2.stkAave.stake(c.avatar),
  allow.mainnet.aave_v2.stkAave.claimRewardsAndStake(c.avatar),
  allow.mainnet.aave_v2.stkAave.redeem(c.avatar),
  allow.mainnet.aave_v2.stkAave.cooldown(),
  allow.mainnet.aave_v2.stkAave.claimRewards(c.avatar),

  // Aave v3 - DAI
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),

  // Aave v3 - USDC
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),

  // Aave - Delegate Aave and stkAave to governance.karpatkey.eth
  allow.mainnet.aave_v2.aave.delegate(GOVERNANCE_KPK),
  allow.mainnet.aave_v2.stkAave.delegate(GOVERNANCE_KPK),

  // Compound v2 - AAVE
  allow.mainnet.compound_v2.cAAVE.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cAAVE.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cAAVE.redeemUnderlying(),

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

  // Compound v3 - USDC
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    c.avatar
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

  // StakeWise
  // The stake() was added manually to the abi(source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
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
      tokenId: 418686, // Created in transaction with hash 0x198d10fc36ecfd2050990a5f1286d3d7ad226b4b482956d689d7216634fd7503.
    },
  ),
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: c.avatar,
    }
  ),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WBTC,
    token1: WETH,
    fee: 3000,
    recipient: c.avatar,
  }),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
    {
      tokenId: 430246, // Created in transaction with hash 0x8dc0368be4a8a28ab431a33ccf49acc85a4ca00a6c212c5d070a74af8aa0541f.
    },
  ),

  // SWAPS
  // Balancer - Swaps
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

  // SushiSwap - Swapping of tokens COMP, DAI, USDC, USDT, WETH
  // WARNING!: we are not scopping the route (reason why we removed it from ENS)
  allow.mainnet.sushiswap.route_processor_3_2.processRoute(
    c.or(COMP, DAI, USDC, USDT, WETH),
    undefined,
    c.or(DAI, USDC, USDT, WETH),
    undefined,
    c.avatar
  ),

  // Uniswap v2 and Uniswap v3 - Swaps
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
    c.avatar
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
    recipient: c.avatar,
  })
] satisfies PermissionList