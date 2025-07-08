import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  AAVE,
  AURA,
  BAL,
  CRV,
  CVX,
  DAI,
  eETH,
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
  weETH,
  WETH,
  wNXM,
  wstETH,
  aaveV3,
  aura,
  balancerV2,
  balancerV3,
  curve,
  fluid,
  nexus,
} from "@/addresses/eth"
import { zeroAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // ACI - Claim Merit Rewards (through Merkle)
    allow.mainnet.merkl.angleDistributor.claim([parameters.avatar]),

    // Aave Umbrella Staking - GHO
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.unmbrellaBatchHelper]),
    allow.mainnet.aaveV3.unmbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthGHO,
      edgeToken: GHO,
    }),
    allowErc20Approve([GHO], [aaveV3.stkEthGHO]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthGHO,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthGHO,
    },
    allow.mainnet.aaveV3.unmbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthGHO,
      edgeToken: GHO,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthGHO,
    },

    // Aave Umbrella Staking - USDC
    allowErc20Approve([USDC], [contracts.mainnet.aaveV3.unmbrellaBatchHelper]),
    allow.mainnet.aaveV3.unmbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthUSDC,
      edgeToken: USDC,
    }),
    allowErc20Approve([USDC], [aaveV3.stkEthUSDC]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthUSDC,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthUSDC,
    },
    allow.mainnet.aaveV3.unmbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthUSDC,
      edgeToken: USDC,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthUSDC,
    },

    // Aave Umbrella Staking - USDT
    allowErc20Approve([USDT], [contracts.mainnet.aaveV3.unmbrellaBatchHelper]),
    allow.mainnet.aaveV3.unmbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthUSDT,
      edgeToken: USDT,
    }),
    allowErc20Approve([USDT], [aaveV3.stkEthUSDT]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthUSDT,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthUSDT,
    },
    allow.mainnet.aaveV3.unmbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthUSDT,
      edgeToken: USDT,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthUSDT,
    },

    // Claim Umbrella Staking Rewards
    allow.mainnet.aaveV3.umbrellaRewardsController[
      "claimSelectedRewards(address,address[],address)"
    ](undefined, undefined, c.avatar),

    // Aura - Aave Boosted USDT/GHO/USDC
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("246"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },

    // Balancer v2 - BCoW AMM wNXM/WETH (Staking not available)
    ...allowErc20Approve(
      [wNXM, WETH],
      [contracts.mainnet.balancerV2.bCow50Wnxm50Weth]
    ),
    allow.mainnet.balancerV2.bCow50Wnxm50Weth.joinPool(),
    allow.mainnet.balancerV2.bCow50Wnxm50Weth.exitPool(),

    // Balancer v3 - Aave Boosted USDT/GHO/USDC
    ...allowErc20Approve(
      [GHO, USDC, USDT],
      [contracts.mainnet.uniswap.permit2]
    ),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC, USDT),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    ...allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [balancerV3.aaveGhoUsdtUsdcGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },

    // Compound v3 - Deposit ETH
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

    // Compound v3 - Deposit USDC
    ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
    allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
    allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

    // Compound v3 - Deposit USDT
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

    // Ether.fi
    // Stake ETH for eETH
    allow.mainnet.etherfi.liquidityPool["deposit()"]({ send: true }),
    // Request Withdrawal - A Withdraw Request NFT is issued
    ...allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
    allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
    // Funds can be claimed once the request is finalized
    allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
    // Stake ETH for weETH
    allow.mainnet.etherfi.depositAdapter.depositETHForWeETH(undefined, {
      send: true,
    }),
    // Wrap eETH
    ...allowErc20Approve([eETH], [contracts.mainnet.etherfi.weEth]),
    allow.mainnet.etherfi.weEth.wrap(),
    // Unwrap weETH
    allow.mainnet.etherfi.weEth.unwrap(),

    // Fluid - USDC
    allowErc20Approve([USDC], [fluid.fUsdc]),
    {
      ...allow.mainnet.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },
    {
      ...allow.mainnet.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },
    {
      ...allow.mainnet.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },
    // Fluid - USDT
    allowErc20Approve([USDT], [fluid.fUsdt]),
    {
      ...allow.mainnet.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },
    {
      ...allow.mainnet.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },
    {
      ...allow.mainnet.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },

    // Morpho - Gauntlet USDC Prime
    allowErc20Approve([USDC], [contracts.mainnet.morpho.gtUsdc]),
    allow.mainnet.morpho.gtUsdc.deposit(undefined, c.avatar),
    allow.mainnet.morpho.gtUsdc.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.morpho.gtUsdc.redeem(undefined, c.avatar, c.avatar),

    // Morpho - Steakhouse USDC
    allowErc20Approve([USDC], [contracts.mainnet.morpho.steakUSDC]),
    allow.mainnet.morpho.steakUSDC.deposit(undefined, c.avatar),
    allow.mainnet.morpho.steakUSDC.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.morpho.steakUSDC.redeem(undefined, c.avatar, c.avatar),

    // Morpho Claim Rewards (through Merkle)
    allow.mainnet.merkl.angleDistributor.claim([parameters.avatar]),

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

    // Sky - DSR (DAI Savings Rate)
    // The DsrManager provides an easy to use smart contract that allows
    // service providers to deposit/withdraw dai into the DSR contract pot,
    // and activate/deactivate the Dai Savings Rate to start earning savings
    // on a pool of dai in a single function call.
    // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
    ...allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
    allow.mainnet.sky.dsrManager.join(c.avatar),
    allow.mainnet.sky.dsrManager.exit(c.avatar),
    allow.mainnet.sky.dsrManager.exitAll(c.avatar),

    /*********************************************
     * Swaps
     *********************************************/
    // Balancer - osETH <-> WETH
    balancerV2Swap(balancerV2.osEthWethPid, [osETH, WETH], [osETH, WETH]),

    // Uniswap v3
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
        weETH,
        WETH,
        wNXM,
        wstETH,
      ],
      [contracts.mainnet.uniswapV3.router2]
    ),
    // Uniswap v3 - [AAVE, AURA, BAL, CRV, CVX, DAI, GHO, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, WNXM, wstETH] ->
    // [DAI, GHO, osETH, rETH, stETH, USDC, USDT, WETH, wNXM, wstETH]
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

    // Uniswap v3 - [weETH <-> WETH], Fee: [0.01, 0.05]
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(weETH, WETH),
      tokenOut: c.or(weETH, WETH),
      recipient: c.avatar,
      fee: c.or(100, 500),
    }),
  ] satisfies PermissionList
