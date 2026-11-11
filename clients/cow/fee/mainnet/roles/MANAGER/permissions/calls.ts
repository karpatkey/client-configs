import { allow } from "zodiac-roles-sdk/kit"
import { WETH } from "@/addresses/eth"
import { mainTreasury } from "../../../../../addresses"
import { PermissionList } from "@/types"
import {
  allowAssistedBalanceRecoveryMainnet,
  allowErc20Transfer,
} from "@/helpers"
import { allowEthTransfer } from "@/helpers"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer ETH to Main Treasury
  allowEthTransfer(mainTreasury),
  // Transfer WETH to Main Treasury
  allowErc20Transfer([WETH], [mainTreasury]),

  // onchain-accounting - Assisted balance adapters (ADR 0030): Safe-side
  // evict / submit / remove of its own entries
  ...allowAssistedBalanceRecoveryMainnet(),
] satisfies PermissionList
