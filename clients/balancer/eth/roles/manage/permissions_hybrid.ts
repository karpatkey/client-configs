import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  AAVE,
  ankrETH,
  COMP,
  DAI,
  ETHx,
  rETH,
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
  * Defi-Kit permissions
  *********************************************/
  // Aave v2 - Staking of AAVE in Safety Module
  allowAction.aave_v2.stake({ targets: ["AAVE"] }),

  // // Compound v3 - cUSDCv3 - USDC
  // allowAction.compound_v3.deposit({
  //   targets: ["cUSDCv3"],
  //   tokens: ["USDC"],
  // }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  // WARNING!: With the deposit action we are allowing to send ETH and the functions that involve ETH.
  allowAction.uniswap_v3.deposit({ tokens: ["WBTC", "WETH"], fees: ["0.3%"] }),

  /*********************************************
  * Typed-presets permissions
  *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

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

  // Compound v3 - USDC
  allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    undefined,
    c.avatar
  ),

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
