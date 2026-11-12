import { COW, sDAI, sUSDS, USDC, WETH } from "@/addresses/eth"
import {
  mainTreasury,
  legalDefenseFund,
  buyBack,
} from "../../../../../addresses"
import {
  allowAssistedBalanceRecoveryMainnet,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer COW, USDC, WETH to Main Treasury
  allowErc20Transfer([COW, USDC, WETH], [mainTreasury]),

  // Transfer sDAI, sUSDS, USDC to Legal Defense Fund
  allowErc20Transfer([sDAI, sUSDS, USDC], [legalDefenseFund]),

  // Transfer COW to Buyback Recipient
  allowErc20Transfer([COW], [buyBack]),

  // onchain-accounting - Assisted balance adapters (ADR 0030): Safe-side
  // evict / submit / remove of its own entries
  ...allowAssistedBalanceRecoveryMainnet(),
] satisfies PermissionList
