import { allow } from "zodiac-roles-sdk/kit"
import {
  WXDAI,
  sDAI,
  USDC,
  USDCe,
  balancer,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  // Balancer - USDT/sDAI/USDC Pool - Swap sDAI <-> USDC
  balancer__swap(balancer.sBAL3_pId, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - USDT/sDAI/USDC.e pool - Swap sDAI <-> USDC.e
  balancer__swap(balancer.sBAL3_2_pId, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDT/USDC/WXDAI pool - Swap USDC <-> WXDAI
  balancer__swap(balancer.staBAL3_pId, [USDC, WXDAI], [USDC, WXDAI]),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.deposit(),
] satisfies PermissionList