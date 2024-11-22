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
    [contracts.mainnet.balancer.BCoW_50COW_50wstETH]
  ),
  allow.mainnet.balancer.BCoW_50COW_50wstETH.joinPool(),
  allow.mainnet.balancer.BCoW_50COW_50wstETH.exitPool(),

  // Balancer - BCoW AMM USDC/WETH
  ...allowErc20Approve(
    [USDC, WETH],
    [contracts.mainnet.balancer.BCoW_50WETH_50USDC]
  ),
  allow.mainnet.balancer.BCoW_50WETH_50USDC.joinPool(),
  allow.mainnet.balancer.BCoW_50WETH_50USDC.exitPool(),
  ...allowErc20Approve(
    [contracts.mainnet.balancer.BCoW_50WETH_50USDC],
    [contracts.mainnet.balancer.BCoW_50WETH_50USDC_gauge]
  ),
  allow.mainnet.balancer.BCoW_50WETH_50USDC_gauge["withdraw(uint256)"](),
  allow.mainnet.balancer.BCoW_50WETH_50USDC_gauge["claim_rewards()"](),
  allow.mainnet.balancer.BCoW_50WETH_50USDC_gauge["deposit(uint256)"](),
  allow.mainnet.balancer.vault.setRelayerApproval(
    c.avatar,
    contracts.mainnet.balancer.relayer
  ),
  // gaugeClaimRewards() and gaugeWithdraw() added manually to the Relayer v6 ABI
  // from the RelayerLibrary: 0xeA66501dF1A00261E3bB79D1E90444fc6A186B62
  allow.mainnet.balancer.relayer.gaugeClaimRewards([
    contracts.mainnet.balancer.BCoW_50WETH_50USDC_gauge,
  ]),
  allow.mainnet.balancer.relayer.gaugeWithdraw(
    contracts.mainnet.balancer.BCoW_50WETH_50USDC_gauge,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
