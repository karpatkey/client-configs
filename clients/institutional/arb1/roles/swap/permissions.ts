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
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  // CowSwap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [COMP, DAI, USDC, USDCe],
    buy: [DAI, USDC, USDCe],
  }),

  // Balancer - USDC/DAI/USDT/USDC.e Pool - Swap [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  balancer__swap(balancer._4POOL_pId, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

  // Uniswap v3 - Swap [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
  ...allowErc20Approve(
    [DAI, USDC, USDCe],
    [contracts.mainnet.uniswap_v3.router_2]
  ),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDCe),
    tokenOut: c.or(DAI, USDC, USDCe),
    recipient: c.avatar,
  }),
] satisfies PermissionList
