import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  sDAI,
  USDC,
  USDCe,
  WXDAI,
  eAddress,
  balancer,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  // Balancer - USDT/sDAI/USDC Pool - Swap sDAI <-> USDC
  balancer__swap(balancer.sBal3Pid, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - USDT/sDAI/USDC.e pool - Swap sDAI <-> USDC.e
  balancer__swap(balancer.sBAL3NewPid, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDT/USDC/WXDAI pool - Swap USDC <-> WXDAI
  balancer__swap(balancer.staBal3Pid, [USDC, WXDAI], [USDC, WXDAI]),

  // CowSwap - [sDAI, USDC, USDCe, WXDAI] -> [eAddress, sDAI, USDC, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: [eAddress, sDAI, USDC, USDCe, WXDAI],
  }),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.deposit(),
] satisfies PermissionList
