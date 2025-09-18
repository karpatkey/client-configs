import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { crvUSD, DAI, USDC, USDCe, balancer } from "@/addresses/oeth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default [
  // Balancer - [DAI, USDC, USDCe] <-> [DAI, USDC, USDCe]
  balancerV2Swap(
    balancer.stableBeetsPid,
    [DAI, USDC, USDCe],
    [DAI, USDC, USDCe]
  ),

  // Curve - DAI <-> USDC.e
  allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.x3CrvPool]),
  allow.optimism.curve.x3CrvPool["exchange(int128,int128,uint256,uint256)"](
    c.or(0, 1), // 0 = DAI, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - crvUSDC <-> USDC
  allowErc20Approve(
    [crvUSD, USDC],
    [contracts.optimism.curve.crvUsdUsdcPool]
  ),
  allow.optimism.curve.crvUsdUsdcPool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC
    c.or(0, 1)
  ),

  // Curve - crvUSDC <-> USDC.e
  allowErc20Approve(
    [crvUSD, USDCe],
    [contracts.optimism.curve.crvUsdUsdcePool]
  ),
  allow.optimism.curve.crvUsdUsdcePool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - DAI <-> USDC.e
  allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.sUsd3CrvPool]),
  allow.optimism.curve.sUsd3CrvPool[
    "exchange_underlying(int128,int128,uint256,uint256)"
  ](
    c.or(1, 2), // 1 = DAI, 2 = USDC.e
    c.or(1, 2)
  ),
] satisfies PermissionList
