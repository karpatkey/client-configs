import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  ETHx,
  OETH,
  osETH,
  rETH,
  SAFE,
  stETH,
  USDC,
  USDT,
  WETH,
  wstETH,
  x3CRV,
  aura,
  curve,
  uniswapV2,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Aura - Aave Lido Boosted WETH/wstETH
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.aaveLidoWethWstEth],
    [contracts.mainnet.aura.booster]
  ),
  allow.mainnet.aura.booster.deposit("240"),
  {
    ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    targetAddress: aura.auraAaveLidoWethWstEthRewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward()"](),
    targetAddress: aura.auraAaveLidoWethWstEthRewarder,
  },
  {
    ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
    targetAddress: aura.auraAaveLidoWethWstEthRewarder,
  },

  // Balancer v2 - BCoW-50WETH-50USDC
  ...allowErc20Approve(
    [USDC, WETH],
    [contracts.mainnet.balancerV2.bCow50Weth50Usdc]
  ),
  allow.mainnet.balancerV2.bCow50Weth50Usdc.joinPool(),
  allow.mainnet.balancerV2.bCow50Weth50Usdc.exitPool(),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV2.bCow50Weth50Usdc],
    [contracts.mainnet.balancerV2.bCow50Weth50UsdcGauge]
  ),
  allow.mainnet.balancerV2.bCow50Weth50UsdcGauge["deposit(uint256)"](),
  allow.mainnet.balancerV2.bCow50Weth50UsdcGauge["withdraw(uint256)"](),
  allow.mainnet.balancerV2.bCow50Weth50UsdcGauge["claim_rewards()"](),
  allow.mainnet.balancerV2.minter.mint(
    contracts.mainnet.balancerV2.bCow50Weth50UsdcGauge
  ),

  // Balancer v2 - BCoW-50SAFE-50WETH (Staking not available)
  ...allowErc20Approve(
    [SAFE, WETH],
    [contracts.mainnet.balancerV2.bCow50Safe50Weth]
  ),
  allow.mainnet.balancerV2.bCow50Safe50Weth.joinPool(),
  allow.mainnet.balancerV2.bCow50Safe50Weth.exitPool(),

  // Balancer v3 - Aave Lido Boosted WETH/wstETH
  ...allowErc20Approve([WETH, wstETH], [contracts.mainnet.uniswap.permit2]),
  allow.mainnet.uniswap.permit2.approve(
    c.or(WETH, wstETH),
    contracts.mainnet.balancerV3.compositeLiquidityRouter
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    contracts.mainnet.balancerV3.aaveLidoWethWstEth
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    contracts.mainnet.balancerV3.aaveLidoWethWstEth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.aaveLidoWethWstEth],
    [contracts.mainnet.balancerV3.compositeLiquidityRouter]
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    contracts.mainnet.balancerV3.aaveLidoWethWstEth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.aaveLidoWethWstEth],
    [contracts.mainnet.balancerV3.aaveLidoWethWstEthGuage]
  ),
  allow.mainnet.balancerV3.aaveLidoWethWstEthGuage["deposit(uint256)"](),
  allow.mainnet.balancerV3.aaveLidoWethWstEthGuage["withdraw(uint256)"](),
  allow.mainnet.balancerV3.aaveLidoWethWstEthGuage["claim_rewards()"](),
  allow.mainnet.balancerV2.minter.mint(
    contracts.mainnet.balancerV3.aaveLidoWethWstEthGuage
  ),

  // Balancer v3 - Aave Boosted WETH/ETHx
  ...allowErc20Approve([WETH, ETHx], [contracts.mainnet.uniswap.permit2]),
  allow.mainnet.uniswap.permit2.approve(
    c.or(WETH, ETHx),
    contracts.mainnet.balancerV3.compositeLiquidityRouter
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    contracts.mainnet.balancerV3.ethxWaWeth
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    contracts.mainnet.balancerV3.ethxWaWeth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.ethxWaWeth],
    [contracts.mainnet.balancerV3.compositeLiquidityRouter]
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    contracts.mainnet.balancerV3.ethxWaWeth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.ethxWaWeth],
    [contracts.mainnet.balancerV3.ethxWaWethGauge]
  ),
  allow.mainnet.balancerV3.ethxWaWethGauge["deposit(uint256)"](),
  allow.mainnet.balancerV3.ethxWaWethGauge["withdraw(uint256)"](),
  allow.mainnet.balancerV3.ethxWaWethGauge["claim_rewards()"](),
  allow.mainnet.balancerV2.minter.mint(
    contracts.mainnet.balancerV3.ethxWaWethGauge
  ),

  // Balancer v3 - Aave Boosted WETH/osETH
  ...allowErc20Approve([WETH, osETH], [contracts.mainnet.uniswap.permit2]),
  allow.mainnet.uniswap.permit2.approve(
    c.or(WETH, osETH),
    contracts.mainnet.balancerV3.compositeLiquidityRouter
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    contracts.mainnet.balancerV3.osEthWaWeth
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    contracts.mainnet.balancerV3.osEthWaWeth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.osEthWaWeth],
    [contracts.mainnet.balancerV3.compositeLiquidityRouter]
  ),
  allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    contracts.mainnet.balancerV3.osEthWaWeth
  ),
  ...allowErc20Approve(
    [contracts.mainnet.balancerV3.osEthWaWeth],
    [contracts.mainnet.balancerV3.osEthWaWethGauge]
  ),
  allow.mainnet.balancerV3.osEthWaWethGauge["deposit(uint256)"](),
  allow.mainnet.balancerV3.osEthWaWethGauge["withdraw(uint256)"](),
  allow.mainnet.balancerV3.osEthWaWethGauge["claim_rewards()"](),
  allow.mainnet.balancerV2.minter.mint(
    contracts.mainnet.balancerV3.osEthWaWethGauge
  ),

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

  // Curve - x3CRV - DAI/USDC/USDT
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.add_liquidity(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity_imbalance(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity_one_coin(),
  ...allowErc20Approve(
    [contracts.mainnet.curve.x3CrvPool],
    [contracts.mainnet.curve.x3CrvGauge]
  ),
  allow.mainnet.curve.x3CrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.x3CrvGauge.withdraw(),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.x3CrvGauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.x3CrvGauge.set_approve_deposit(
    contracts.mainnet.curve.stakeDepositZap
  ),

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

  // Curve - ETH/OETH
  ...allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
  allow.mainnet.curve.oEthCrvPool["add_liquidity(uint256[2],uint256)"](
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.curve.oEthCrvPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.oEthCrvPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.oEthCrvPool],
    [contracts.mainnet.curve.oEthCrvGauge]
  ),
  allow.mainnet.curve.oEthCrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["withdraw(uint256)"](),
  allow.mainnet.curve.oEthCrvGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.oEthCrvGauge),

  // Curve - osETH/rETH
  ...allowErc20Approve([osETH, rETH], [contracts.mainnet.curve.osEthRethPool]),

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

  // Curve - WETH/rETH
  ...allowErc20Approve([WETH, rETH], [contracts.mainnet.curve.wethRethPool]),
  allow.mainnet.curve.wethRethPool["add_liquidity(uint256[],uint256)"](),
  allow.mainnet.curve.wethRethPool["remove_liquidity(uint256,uint256[])"](),
  allow.mainnet.curve.wethRethPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.wethRethPool[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.wethRethPool],
    [contracts.mainnet.curve.wethRethGauge]
  ),
  allow.mainnet.curve.wethRethGauge["deposit(uint256)"](),
  allow.mainnet.curve.wethRethGauge["withdraw(uint256)"](),
  allow.mainnet.curve.wethRethGauge["withdraw(uint256,bool)"](),
  allow.mainnet.curve.wethRethGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.wethRethGauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [DAI, OETH, rETH, stETH, USDC, USDT, WETH],
    [contracts.mainnet.curve.stakeDepositZap]
  ),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.x3CrvPool,
      contracts.mainnet.curve.steCrvPool,
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.osEthRethPool,
      contracts.mainnet.curve.wethRethPool
    ),
    c.or(
      x3CRV,
      curve.steCrv,
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.osEthRethPool,
      contracts.mainnet.curve.wethRethPool
    ),
    c.or(
      contracts.mainnet.curve.x3CrvGauge,
      contracts.mainnet.curve.steCrvPoolGauge,
      contracts.mainnet.curve.oEthCrvGauge,
      contracts.mainnet.curve.osEthRethGauge,
      contracts.mainnet.curve.wethRethGauge
    ),
    c.or(2, 3),
    c.or(
      [DAI, USDC, USDT],
      [eAddress, stETH],
      [eAddress, OETH],
      [osETH, rETH],
      [WETH, rETH]
    ),
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress,
    { send: true }
  ),

  // Origin - Mint OETH
  allow.mainnet.origin.oEthZapper.deposit({ send: true }),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.oEthVault.requestWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawals(),

  // Uniswap v2 - ETH/USDC
  allowErc20Approve([USDC], [contracts.mainnet.uniswapV2.router2]),
  allow.mainnet.uniswapV2.router2.addLiquidityETH(
    USDC,
    undefined,
    undefined,
    undefined,
    c.avatar,
    undefined,
    {
      send: true,
    }
  ),
  allowErc20Approve([uniswapV2.usdcEth], [contracts.mainnet.uniswapV2.router2]),
  allow.mainnet.uniswapV2.router2.removeLiquidityETH(
    USDC,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),

  // Uniswap v2 - ETH/USDT
  allowErc20Approve([USDT], [contracts.mainnet.uniswapV2.router2]),
  allow.mainnet.uniswapV2.router2.addLiquidityETH(
    USDT,
    undefined,
    undefined,
    undefined,
    c.avatar,
    undefined,
    {
      send: true,
    }
  ),
  allowErc20Approve([uniswapV2.usdtEth], [contracts.mainnet.uniswapV2.router2]),
  allow.mainnet.uniswapV2.router2.removeLiquidityETH(
    USDT,
    undefined,
    undefined,
    undefined,
    c.avatar
  ),
] satisfies PermissionList
