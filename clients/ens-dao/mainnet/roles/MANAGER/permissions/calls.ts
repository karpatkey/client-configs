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
  OETH,
  osETH,
  rETH,
  RPL,
  sDAI,
  stETH,
  SWISE,
  USDC,
  USDM,
  USDT,
  WETH,
  wstETH,
  x3CRV,
  balancerV2,
  curve,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

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

  // Curve - x3CRV - DAI/USDC/USDT
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.add_liquidity(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity_imbalance(),
  allow.mainnet.curve.x3CrvPool.remove_liquidity_one_coin(),
  ...allowErc20Approve([x3CRV], [contracts.mainnet.curve.x3CrvGauge]),
  allow.mainnet.curve.x3CrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.x3CrvGauge.withdraw(),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.x3CrvGauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.x3CrvGauge.set_approve_deposit(
    contracts.mainnet.curve.stakeDepositZap
  ),

  // Curve - sDAI/USDM
  ...allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sDaiUsdmPool]),
  allow.mainnet.curve.sDaiUsdmPool["add_liquidity(uint256[],uint256)"](),
  allow.mainnet.curve.sDaiUsdmPool["remove_liquidity(uint256,uint256[])"](),
  allow.mainnet.curve.sDaiUsdmPool[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  allow.mainnet.curve.sDaiUsdmPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.sDaiUsdmPool],
    [contracts.mainnet.curve.sDaiUsdmGauge]
  ),
  allow.mainnet.curve.sDaiUsdmGauge["deposit(uint256)"](),
  allow.mainnet.curve.sDaiUsdmGauge["withdraw(uint256)"](),
  allow.mainnet.curve.sDaiUsdmGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.sDaiUsdmGauge),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [DAI, OETH, sDAI, stETH, USDC, USDM, USDT],
    [contracts.mainnet.curve.stakeDepositZap]
  ),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steCrvPool,
      contracts.mainnet.curve.stEthNgfPool,
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.x3CrvPool,
      contracts.mainnet.curve.sDaiUsdmPool
    ),
    c.or(
      curve.steCrv,
      contracts.mainnet.curve.stEthNgfPool,
      contracts.mainnet.curve.oEthCrvPool,
      x3CRV,
      contracts.mainnet.curve.sDaiUsdmPool
    ),
    c.or(
      contracts.mainnet.curve.steCrvPoolGauge,
      contracts.mainnet.curve.stEthNgfGauge,
      contracts.mainnet.curve.oEthCrvGauge,
      contracts.mainnet.curve.x3CrvGauge,
      contracts.mainnet.curve.sDaiUsdmGauge
    ),
    c.or(2, 3),
    c.or([eAddress, stETH], [eAddress, OETH], [DAI, USDC, USDT], [sDAI, USDM]),
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress,
    { send: true }
  ),

  // Origin - Mint OETH
  allow.mainnet.origin.oEthZapper.deposit({ send: true }),
  // Origin - Redeem via ARM (Automated Redemption Manager)
  allowErc20Approve([OETH], [contracts.mainnet.origin.armOethWeth]),
  allow.mainnet.origin.armOethWeth[
    "swapExactTokensForTokens(address,address,uint256,uint256,address)"
  ](OETH, WETH, undefined, undefined, c.avatar),
  // Origin - Redeem via OETH Vault
  // OETH is burnt by the user so no approval is needed
  allow.mainnet.origin.oEthVault.requestWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawal(),
  allow.mainnet.origin.oEthVault.claimWithdrawals(),

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

  /*********************************************
   * SWAPS
   *********************************************/
  // Balancer - AURA -> WETH
  balancerV2Swap(balancerV2.b50Weth50AuraPid, [AURA], [WETH]),
  // Balancer - BAL -> WETH
  balancerV2Swap(balancerV2.b80Bal20WethPid, [BAL], [WETH]),
  // Balancer - WETH -> DAI
  balancerV2Swap(balancerV2.b60Weth40DaiPid, [WETH], [DAI]),
  // Balancer - WETH -> USDC
  balancerV2Swap(balancerV2.b50Usdc50WethPid, [WETH], [USDC]),
  // Balancer - COMP -> WETH
  balancerV2Swap(balancerV2.b50Comp50WethPid, [COMP], [WETH]),
  // Balancer - WETH <-> wstETH
  balancerV2Swap(balancerV2.bStEthStablePid, [WETH, wstETH], [WETH, wstETH]),
  // Balancer - WETH <-> wstETH
  balancerV2Swap(balancerV2.eclpWstEthWethPid, [WETH, wstETH], [WETH, wstETH]),
  // Balancer - rETH <-> WETH
  balancerV2Swap(balancerV2.bREthStablePid, [rETH, WETH], [rETH, WETH]),
  // Balancer - ankrETH <-> wstETH
  balancerV2Swap(
    balancerV2.ankrEthWstEthPid,
    [ankrETH, wstETH],
    [ankrETH, wstETH]
  ),
  // Balancer - ETHx <-> WETH
  balancerV2Swap(balancerV2.ethxWethPid, [ETHx, WETH], [ETHx, WETH]),
  // Balancer - osETH <-> WETH
  balancerV2Swap(balancerV2.osEthWethPid, [osETH, WETH], [osETH, WETH]),
  // Balancer - OETH <-> WETH
  balancerV2Swap(balancerV2.oEthWethPid, [OETH, WETH], [OETH, WETH]),
  // Balancer - USDC <-> USDT
  balancerV2Swap(balancerV2.usdcUsdtPid, [USDC, USDT], [USDC, USDT]),

  // Curve - ETH <-> stETH
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

  // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
  ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.exchange(),

  // Curve - CVX -> ETH
  ...allowErc20Approve([CVX], [contracts.mainnet.curve.cvxEthPool]),
  allow.mainnet.curve.cvxEthPool["exchange(uint256,uint256,uint256,uint256)"](
    1,
    0
  ),

  // Curve - ankrETH <-> ETH
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

  // Curve - ETH <-> OETH
  allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
  allow.mainnet.curve.oEthCrvPool["exchange(int128,int128,uint256,uint256)"](
    undefined,
    undefined,
    undefined,
    undefined,
    {
      send: true,
    }
  ),

  // Curve - sDAI <-> USDM
  allowErc20Approve([sDAI, USDM], [contracts.mainnet.curve.sDaiUsdmPool]),
  allow.mainnet.curve.sDaiUsdmPool["exchange(int128,int128,uint256,uint256)"](),

  // PancakeSwap - ETHx <-> WETH
  ...allowErc20Approve(
    [ETHx, WETH],
    [contracts.mainnet.pancakeSwap.smartRouter]
  ),
  allow.mainnet.pancakeSwap.smartRouter.exactInputSingle({
    tokenIn: c.or(ETHx, WETH),
    tokenOut: c.or(ETHx, WETH),
    recipient: c.avatar,
  }),

  // Uniswap v3 - [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, osETH, rETH, RPL, stETH, SWISE, USDC, USDT, WETH, wstETH] ->
  // [DAI, rETH, USDC, USDT, stETH, WETH, wstETH]
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

  // Uniswap v3 - [USDT <-> WETH], Fee: [0.01, 0.05, 0.3]
  ...allowErc20Approve([USDT, WETH], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDT, WETH),
    tokenOut: c.or(USDT, WETH),
    recipient: c.avatar,
    fee: c.or(100, 500, 3000),
  }),

  // Uniswap v3 - [USDC <-> WETH], Fee: [0.05, 0.3]
  ...allowErc20Approve([USDC, WETH], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDC, WETH),
    tokenOut: c.or(USDC, WETH),
    recipient: c.avatar,
    fee: c.or(500, 3000),
  }),

  // Uniswap v3 - [USDM <-> USDT], Fee: [0.05]
  ...allowErc20Approve([USDM, USDT], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDM, USDT),
    tokenOut: c.or(USDM, USDT),
    recipient: c.avatar,
    fee: 500,
  }),

  // Uniswap v3 - [USDC <-> USDT], Fee: [0.01]
  ...allowErc20Approve([USDC, USDT], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(USDC, USDT),
    tokenOut: c.or(USDT, USDC),
    recipient: c.avatar,
    fee: 100,
  }),
] satisfies PermissionList
