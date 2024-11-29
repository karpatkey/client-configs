import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  crvUSD,
  DAI,
  USDC,
  USDCe,
  balancer,
} from "../../../../../eth-sdk/addresses_opt"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  // Balancer - USDC/USDC.e/DAI/USDT Pool - Swap [DAI, USDC, USDCe] <-> [DAI, USDC, USDCe]
  balancer__swap(
    balancer.stableBeetsPid,
    [DAI, USDC, USDCe],
    [DAI, USDC, USDCe]
  ),

  // Curve - 3pool - Swap DAI <-> USDC.e
  ...allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.x3CrvPool]),
  allow.optimism.curve.x3CrvPool["exchange(int128,int128,uint256,uint256)"](
    c.or(0, 1), // 0 = DAI, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - crvUSDC/USDC - Swap crvUSDC <-> USDC
  ...allowErc20Approve(
    [crvUSD, USDC],
    [contracts.optimism.curve.crvUsdUsdcPool]
  ),
  allow.optimism.curve.crvUsdUsdcPool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC
    c.or(0, 1)
  ),

  // Curve - crvUSDC/USDC.e - Swap crvUSDC <-> USDC.e
  ...allowErc20Approve(
    [crvUSD, USDCe],
    [contracts.optimism.curve.crvUsdUsdcePool]
  ),
  allow.optimism.curve.crvUsdUsdcePool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - sUSD Synthetix - Swap DAI <-> USDC.e
  ...allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.sUsd3CrvPool]),
  allow.optimism.curve.sUsd3CrvPool[
    "exchange_underlying(int128,int128,uint256,uint256)"
  ](
    c.or(1, 2), // 1 = DAI, 2 = USDC.e
    c.or(1, 2)
  ),
] satisfies PermissionList
