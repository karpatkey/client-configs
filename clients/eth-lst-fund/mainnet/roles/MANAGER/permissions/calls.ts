import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  ankrETH,
  AURA,
  BAL,
  cbETH,
  CRV,
  CVX,
  eETH,
  ETHFI,
  ETHx,
  osETH,
  rETH,
  RPL,
  stETH,
  SWISE,
  weETH,
  WETH,
  wstETH,
  curve,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Curve - ETHx/ETH - ethx-f
  ...allowErc20Approve([ETHx], [contracts.mainnet.curve.ethxfPool]),
  allow.mainnet.curve.ethxfPool["add_liquidity(uint256[2],uint256)"](),
  allow.mainnet.curve.ethxfPool["remove_liquidity(uint256,uint256[2])"](),
  allow.mainnet.curve.ethxfPool[
    "remove_liquidity_imbalance(uint256[2],uint256)"
  ](),
  allow.mainnet.curve.ethxfPool[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.ethxfPool],
    [contracts.mainnet.curve.ethxfGauge]
  ),
  allow.mainnet.curve.ethxfGauge["deposit(uint256)"](),
  allow.mainnet.curve.ethxfGauge["withdraw(uint256)"](),
  allow.mainnet.curve.ethxfGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.ethxfGauge),

  // Curve - ankrETH/ETH
  ...allowErc20Approve([ankrETH], [contracts.mainnet.curve.ankrCrvPool]),
  allow.mainnet.curve.ankrCrvPool.add_liquidity(),
  allow.mainnet.curve.ankrCrvPool.remove_liquidity(),
  allow.mainnet.curve.ankrCrvPool.remove_liquidity_imbalance(),
  allow.mainnet.curve.ankrCrvPool.remove_liquidity_one_coin(),
  ...allowErc20Approve([curve.ankrCrv], [contracts.mainnet.curve.ankrCrvGauge]),
  allow.mainnet.curve.ankrCrvGauge["deposit(uint256)"](),
  allow.mainnet.curve.ankrCrvGauge.withdraw(),
  allow.mainnet.curve.ankrCrvGauge["claim_rewards()"](),
  allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.ankrCrvGauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.ankrCrvGauge.set_approve_deposit(
    contracts.mainnet.curve.stakeDepositZap
  ),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([ETHx], [contracts.mainnet.curve.stakeDepositZap]),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.ethxfPool,
      contracts.mainnet.curve.ankrCrvPool
    ),
    c.or(contracts.mainnet.curve.ethxfPool, curve.ankrCrv),
    c.or(
      contracts.mainnet.curve.steCrvPoolGauge,
      contracts.mainnet.curve.stEthNgfGauge
    ),
    2,
    c.or([eAddress, ETHx], [eAddress, ankrETH]),
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress,
    { send: true }
  ),

  // ether.fi - Liquid ETH - Deposit
  ...allowErc20Approve(
    [eETH, weETH, WETH],
    [contracts.mainnet.etherfi.liquidEth]
  ),
  allow.mainnet.etherfi.tellerWithMultiAssetSupport.deposit(
    c.or(eETH, weETH, WETH)
  ),
  // ether.fi - Liquid ETH - Withdraw
  ...allowErc20Approve(
    [contracts.mainnet.etherfi.liquidEth],
    [contracts.mainnet.etherfi.atomicQueue]
  ),
  allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
    contracts.mainnet.etherfi.liquidEth,
    c.or(eETH, weETH)
  ),
] satisfies PermissionList
