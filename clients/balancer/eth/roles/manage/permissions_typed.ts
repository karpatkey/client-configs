import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  AAVE,
  ankrETH,
  COMP,
  DAI,
  ETHx,
  rETH,
  sETH2,
  stkAAVE,
  stETH,
  SWISE,
  USDC,
  USDT,
  WBTC,
  WETH,
  wstETH
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { avatar } from "../../index"
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
  ...allowErc20Approve(
    [contracts.mainnet.aave_v2.aave],
    [contracts.mainnet.aave_v2.stkAave]
  ),
  allow.mainnet.aave_v2.stkAave.stake(c.avatar),
  allow.mainnet.aave_v2.stkAave.claimRewardsAndStake(c.avatar),
  allow.mainnet.aave_v2.stkAave.redeem(c.avatar),
  allow.mainnet.aave_v2.stkAave.cooldown(),
  allow.mainnet.aave_v2.stkAave.claimRewards(c.avatar),

  // Aave v3 - DAI
  allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, avatar),

  // Aave v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Aave - Delegate Aave and stkAave to governance.karpatkey.eth
  allow.mainnet.aave_v2.aave.delegate(GOVERNANCE_KPK),
  allow.mainnet.aave_v2.stkAave.delegate(GOVERNANCE_KPK),

  // Compound v2 - AAVE
  allowErc20Approve([AAVE], [contracts.mainnet.compound_v2.cAAVE]),
  allow.mainnet.compound_v2.cAAVE.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cAAVE.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cAAVE.redeemUnderlying(),

  // Compound v2 - DAI
  allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cDAI]),
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - Claim COMP
  // WARNING!: The address[] parameter with the cTokens[] was removed since it's unnecessary.
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    avatar
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

  // Lido
  ...allowErc20Approve([stETH], [wstETH]),
  ...allowErc20Approve([stETH, wstETH], [contracts.mainnet.lido.unstETH]),
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
  allow.mainnet.lido.unstETH.requestWithdrawalsWithPermit(
    undefined,
    c.avatar
  ),
  allow.mainnet.lido.unstETH.requestWithdrawalsWstETH(
    undefined,
    c.avatar
  ),
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
  allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
  allow.mainnet.maker.dsr_manager.join(avatar),
  allow.mainnet.maker.dsr_manager.exit(avatar),
  allow.mainnet.maker.dsr_manager.exitAll(avatar),

  // Rocket Pool
  ...allowErc20Approve(
    [contracts.mainnet.rocket_pool.rETH],
    [contracts.mainnet.rocket_pool.swap_router]
  ),
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
  // The stake() was added manually to the abi (source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
  // allow.mainnet.stakewise.eth2_staking.stake({
  //   send: true,
  // }), // WARNING!: this permission was removed because ETH staking in StakeWise v2 was deprecated.
  allow.mainnet.stakewise.merkle_distributor["claim"](
    undefined,
    avatar
    // WARNING!: the tokens were removed to give more flexibility to the permission.
  ),

  // StakeWise - Uniswap v3 ETH + sETH2, 0.3%
  ...allowErc20Approve([sETH2, WETH], [contracts.mainnet.uniswapv3.positions_nft]),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WETH,
    token1: sETH2,
    fee: 3000,
    recipient: avatar,
  }),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
    {
      tokenId: 418686, // Created in transaction with hash 0x198d10fc36ecfd2050990a5f1286d3d7ad226b4b482956d689d7216634fd7503.
    },
    { send: true } // WARNING!: This option is not allowed in the original preset but it has to be whitelisted in order to use the pilot extension.
  ),
  allow.mainnet.uniswapv3.positions_nft.refundETH(), // WARNING!: this function is not in the original preset but must be allowed.
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: avatar,
    }
  ),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  ...allowErc20Approve([WBTC, WETH], [contracts.mainnet.uniswapv3.positions_nft]),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint({
    token0: WBTC,
    token1: WETH,
    fee: 3000,
    recipient: avatar,
  }),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
    {
      tokenId: 430246, // Created in transaction with hash 0x8dc0368be4a8a28ab431a33ccf49acc85a4ca00a6c212c5d070a74af8aa0541f.
    },
    { send: true } // WARNING!: This option is not allowed in the original preset but it has to be whitelisted in order to use the pilot extension.
  ),
  // The refundETH(), decreaseLiquidity() and collect() functions have already been whitelisted for StakeWise.

  // SWAPS
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

  // Cowswap - Swapping of AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allowErc20Approve(
    [AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH],
    [contracts.mainnet.cowswap.gpv2_vault_relayer]
  ),
  allow.mainnet.cowswap.order_signer.signOrder(
    {
      sellToken: c.or(
        AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
      ),
      buyToken: c.or(DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH),
      receiver: avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
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

  // Uniswap v3 - Swaps
  allowErc20Approve(
    [AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH],
    [contracts.mainnet.uniswapv3.router_2]
  ),

  // Uniswap v3 - Swapping of tokens AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
  allow.mainnet.uniswapv3.router_2.exactInputSingle({
    tokenIn: c.or(
      AAVE, ankrETH, COMP, DAI, ETHx, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
    ),
    tokenOut: c.or(DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH),
    recipient: avatar,
  })
] satisfies PermissionList
