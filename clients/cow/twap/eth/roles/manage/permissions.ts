import {
  COW,
  sDAI,
  sUSDS,
  USDC,
  WETH,
} from "../../../../../../eth-sdk/addresses"
import { avatar as main, legalDefenseFund, buyBack } from "../../../../main/eth"
import { allowErc20Transfer } from "../../../../../../helpers/erc20"
import { PermissionList } from "../../../../../../types"

export default [
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer COW, USDC, WETH to Main Treasury
  allowErc20Transfer([COW, USDC, WETH], [main]),

  // Transfer sDAI, sUSDS, USDC to Legal Defense Fund
  allowErc20Transfer([sDAI, sUSDS, USDC], [legalDefenseFund]),

  // Transfer COW to Buyback Recipient
  allowErc20Transfer([COW], [buyBack]),
] satisfies PermissionList
