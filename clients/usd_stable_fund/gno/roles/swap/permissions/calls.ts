import { allow } from "zodiac-roles-sdk/kit"
import { sDAI, USDC, USDCe, WXDAI, balancer } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerSwap } from "@/exit_strategies/balancer"

export default [
  // Balancer - sDAI <-> USDC
  balancerSwap(balancer.sBal3Pid, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - sDAI <-> USDC.e
  balancerSwap(balancer.sBAL3NewPid, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDC <-> WXDAI
  balancerSwap(balancer.staBal3Pid, [USDC, WXDAI], [USDC, WXDAI]),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.deposit(),
] satisfies PermissionList
