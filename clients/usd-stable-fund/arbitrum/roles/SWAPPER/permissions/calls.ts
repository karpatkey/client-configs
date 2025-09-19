import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, USDC, USDCe, balancerV2 } from "@/addresses/arb1"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default [
  // Balancer - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  balancerV2Swap(balancerV2.b4PoolPid, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

  // CowSwap - [COMP, DAI, USDC, USDCe] -> [DAI, USDC, USDCe]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, USDC, USDCe],
    buy: [DAI, USDC, USDCe],
  }),

  // Uniswap v3 - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  allowErc20Approve([DAI, USDC, USDCe], [contracts.mainnet.uniswapV3.router2]),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDCe),
    tokenOut: c.or(DAI, USDC, USDCe),
    recipient: c.avatar,
  }),
] satisfies PermissionList
