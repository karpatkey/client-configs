import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { COMP, DAI, USDC, USDCe, balancerV2 } from "@/addresses/arb1"
import { COMP as COMP_eth, DAI as DAI_eth } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default [
  // Compound v3 - Deposit USDC
  allowErc20Approve([USDC], [contracts.arbitrumOne.compoundV3.cUsdcV3]),
  allow.arbitrumOne.compoundV3.cUsdcV3.supply(USDC),
  allow.arbitrumOne.compoundV3.cUsdcV3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.arbitrumOne.compoundV3.cometRewards.claim(undefined, c.avatar),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  balancerV2Swap(balancerV2.b4PoolPid, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

  // Uniswap v3 - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  allowErc20Approve([DAI, USDC, USDCe], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDCe),
    tokenOut: c.or(DAI, USDC, USDCe),
    recipient: c.avatar,
  }),

  /*********************************************
   * Bridge
   *********************************************/
  // Arbitrum -> Mainnet
  // DAI - Arbitrum Bridge
  allowErc20Approve(
    [DAI],
    [contracts.arbitrumOne.arbitrumBridge.gatewayRouter]
  ),
  allow.arbitrumOne.arbitrumBridge.gatewayRouter[
    "outboundTransfer(address,address,uint256,bytes)"
  ](DAI_eth, c.avatar, undefined, "0x"),
  // DAI - HOP
  allowErc20Approve([DAI], [contracts.arbitrumOne.hop.hopDaiWrapper]),
  allow.arbitrumOne.hop.hopDaiWrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),

  // COMP - Arbitrum Bridge
  allowErc20Approve(
    [COMP],
    [contracts.arbitrumOne.arbitrumBridge.gatewayRouter]
  ),
  allow.arbitrumOne.arbitrumBridge.gatewayRouter[
    "outboundTransfer(address,address,uint256,bytes)"
  ](COMP_eth, c.avatar, undefined, "0x"),
] satisfies PermissionList
