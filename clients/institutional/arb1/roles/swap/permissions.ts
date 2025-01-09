import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  DAI,
  USDC,
  USDCe,
  balancer,
} from "../../../../../eth-sdk/addresses_arb"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancerSwap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  // Balancer - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  balancerSwap(balancer.b4PoolPid, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

  // CowSwap - [COMP, DAI, USDC, USDCe] -> [DAI, USDC, USDCe]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, USDC, USDCe],
    buy: [DAI, USDC, USDCe],
  }),

  // Uniswap v3 - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  ...allowErc20Approve(
    [DAI, USDC, USDCe],
    [contracts.mainnet.uniswapV3.router2]
  ),
  allow.mainnet.uniswapV3.router2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDCe),
    tokenOut: c.or(DAI, USDC, USDCe),
    recipient: c.avatar,
  }),
] satisfies PermissionList
