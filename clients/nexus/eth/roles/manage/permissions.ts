import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AAVE,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  ETHx,
  NXM,
  LDO,
  osETH,
  rETH,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
  WNXM,
  wstETH,
  curve,
  aave_v3,
  GHO,
  RPL,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aave v3 - DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - USDT
  allowAction.aave_v3.deposit({ targets: ["USDT"] }),
  // Aave v3 - rETH
  allowAction.aave_v3.deposit({ targets: ["rETH"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - USDC
  allowAction.aave_v3.deposit({ targets: ["osETH"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ targets: ["ETH"] }),
  // Aave v3 - WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - GHO/USDT/USDC
  allowAction.aura.deposit({ targets: ["157"] }),
  // Aura - sDAI/3Pool
  allowAction.aura.deposit({ targets: ["186"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - osETH/WETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - GHO/USDT/USDC
  allowAction.balancer.deposit({ targets: ["GHO/USDT/USDC"] }),
  allowAction.balancer.stake({ targets: ["GHO/USDT/USDC"] }),
  // Balancer - sDAI/3Pool
  allowAction.balancer.deposit({ targets: ["sDAI/3Pool"] }),
  allowAction.balancer.stake({ targets: ["sDAI/3Pool"] }),

  // Convex - ETH/stETH - steCRV
  allowAction.convex.deposit({ targets: ["25"] }),
  // Convex - osETH/rETH
  allowAction.convex.deposit({ targets: ["268"] }),

  // Cowswap
  allowAction.cowswap.swap({
    sell: [
      AURA,
      LDO,
      AAVE,
      WNXM,
      GHO,
      USDC,
      DAI,
      USDT,
      stETH,
      wstETH,
      rETH,
      osETH,
      BAL,
      CRV,
      CVX,
      SWISE,
      RPL,
      WETH,
    ],
    buy: [WETH, E_ADDRESS, USDC, USDT, DAI, stETH, wstETH, rETH, osETH, WNXM],
    feeAmountBp: 200,
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - ETH
  allowAction.spark.deposit({ targets: ["rETH"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),
  // Spark - USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave v3 - Lido Market - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(WETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(WETH, undefined, c.avatar),

  // Aave v3 - Lido Market - ETH
  ...allowErc20Approve(
    [contracts.mainnet.aave_v3.aEthWETH],
    [contracts.mainnet.aave_v3.wrapped_token_gateway_lido_v3]
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_lido_v3.depositETH(
    contracts.mainnet.aave_v3.pool_lido,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_lido_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_lido,
    undefined,
    c.avatar
  ),

  // Aave v3 - Lido Market - wstETH
  ...allowErc20Approve([wstETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(wstETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(wstETH, undefined, c.avatar),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - USDT
  ...allowErc20Approve([USDT], [contracts.mainnet.compound_v3.cUSDTv3]),
  allow.mainnet.compound_v3.cUSDTv3.supply(USDT),
  allow.mainnet.compound_v3.cUSDTv3.withdraw(USDT),

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

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // CoW Swap - Swap ETH
  allow.mainnet.cowswap.order_signer.signOrder(
    {
      sellToken: E_ADDRESS,
      buyToken: c.or(WETH, USDC, USDT, DAI, stETH, wstETH, rETH, osETH, WNXM),
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
      send: true,
    }
  ),

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

  // Curve - osETH/rETH - steCRV
  ...allowErc20Approve([osETH], [contracts.mainnet.curve.steth_eth_pool]),
  ...allowErc20Approve([rETH], [contracts.mainnet.curve.oseth_reth_pool]),

  allow.mainnet.curve.oseth_reth_pool["add_liquidity(uint256[],uint256)"](),
  allow.mainnet.curve.oseth_reth_pool["remove_liquidity(uint256,uint256[])"](),
  allow.mainnet.curve.oseth_reth_pool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.oseth_reth_pool[
    "remove_liquidity_imbalance(uint256[],uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.oseth_reth_pool],
    [contracts.mainnet.curve.oseth_reth_gauge]
  ),
  allow.mainnet.curve.oseth_reth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.oseth_reth_gauge["withdraw(uint256)"](),
  allow.mainnet.curve.oseth_reth_gauge["withdraw(uint256,bool)"](),
  allow.mainnet.curve.oseth_reth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.oseth_reth_gauge),

  // Nexus Mutual
  // Deposit ETH in exchange for NXM; redeem NXM in exchange for ETH
  allow.mainnet.nexus.ramm.swap(undefined, undefined, undefined, {
    send: true,
  }),
  // Wrap NXM
  allow.mainnet.nexus.WXNM.wrap(),
  // Unwrap WNXM
  allow.mainnet.nexus.WXNM.unwrap(),
  // Claim NXM rewards
  allow.mainnet.nexus.token_controller.withdrawNXM(),

  // Uniswap v3 - Swaps
  ...allowErc20Approve(
    [
      AURA,
      LDO,
      AAVE,
      WNXM,
      GHO,
      USDC,
      DAI,
      USDT,
      stETH,
      wstETH,
      rETH,
      osETH,
      BAL,
      CRV,
      CVX,
      SWISE,
      RPL,
      WETH,
    ],
    [contracts.mainnet.uniswap_v3.router_2]
  ),

  // Uniswap v3
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(
      AURA,
      LDO,
      AAVE,
      WNXM,
      GHO,
      USDC,
      DAI,
      USDT,
      stETH,
      wstETH,
      rETH,
      osETH,
      BAL,
      CRV,
      CVX,
      SWISE,
      RPL,
      WETH
    ),
    tokenOut: c.or(WETH, USDC, USDT, DAI, stETH, wstETH, rETH, osETH, WNXM),
    recipient: c.avatar,
  }),
] satisfies PermissionList
