import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COW, USDC, WETH, wstETH } from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),

  // Balancer - COW/GNO
  allowAction.balancer.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50COW-50GNO"] }),
  // Balancer - COW/WETH
  allowAction.balancer.deposit({ targets: ["50COW-50WETH"] }),
  allowAction.balancer.stake({ targets: ["50COW-50WETH"] }),
  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Balancer - BCoW AMM COW/wstETH (Staking not available)
  ...allowErc20Approve(
    [COW, wstETH],
    [contracts.mainnet.balancer.bCow50Cow50Wsteth]
  ),
  allow.mainnet.balancer.bCow50Cow50Wsteth.joinPool(),
  allow.mainnet.balancer.bCow50Cow50Wsteth.exitPool(),

  // Balancer - BCoW AMM USDC/WETH
  ...allowErc20Approve(
    [USDC, WETH],
    [contracts.mainnet.balancer.bCow50Weth50Usdc]
  ),
  allow.mainnet.balancer.bCow50Weth50Usdc.joinPool(),
  allow.mainnet.balancer.bCow50Weth50Usdc.exitPool(),
  ...allowErc20Approve(
    [contracts.mainnet.balancer.bCow50Weth50Usdc],
    [contracts.mainnet.balancer.bCow50Weth50UsdcGauge]
  ),
  allow.mainnet.balancer.bCow50Weth50UsdcGauge["withdraw(uint256)"](),
  allow.mainnet.balancer.bCow50Weth50UsdcGauge["claim_rewards()"](),
  allow.mainnet.balancer.bCow50Weth50UsdcGauge["deposit(uint256)"](),
  allow.mainnet.balancer.vault.setRelayerApproval(
    c.avatar,
    contracts.mainnet.balancer.relayer
  ),
  // gaugeClaimRewards() and gaugeWithdraw() added manually to the Relayer v6 ABI
  // from the RelayerLibrary: 0xeA66501dF1A00261E3bB79D1E90444fc6A186B62
  allow.mainnet.balancer.relayer.gaugeClaimRewards([
    contracts.mainnet.balancer.bCow50Weth50UsdcGauge,
  ]),
  allow.mainnet.balancer.relayer.gaugeWithdraw(
    contracts.mainnet.balancer.bCow50Weth50UsdcGauge,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
