import { allow } from "zodiac-roles-sdk/kit"
import { sDAI, USDC, USDCe, WXDAI, balancerV2 } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default [
  // Balancer - sDAI <-> USDC
  balancerV2Swap(balancerV2.sBal3Pid, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - sDAI <-> USDC.e
  balancerV2Swap(balancerV2.sBAL3NewPid, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDC <-> WXDAI
  balancerV2Swap(balancerV2.staBal3Pid, [USDC, WXDAI], [USDC, WXDAI]),

  // Swap USDC.e -> USDC
  allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  allowErc20Approve([USDC], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
  allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),
] satisfies PermissionList
