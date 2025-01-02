import {
  COW,
  sDAI,
  sUSDS,
  USDC,
  WETH,
} from "../../../../../../eth-sdk/addresses"
import { avatar as main, legalDefenseFund, buyBack } from "../../../../main/eth"
import { transferErc20 } from "../../../../../../helpers/transfers"
import { PermissionList } from "../../../../../../types"

export default [
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer COW to Main Treasury
  transferErc20(COW, main),
  // Transfer USDC to Main Treasury
  transferErc20(USDC, main),
  // Transfer WETH to Main Treasury
  transferErc20(WETH, main),

  // Transfer sDAI to Legal Defense Fund
  transferErc20(sDAI, legalDefenseFund),
  // Transfer sUSDS to Legal Defense Fund
  transferErc20(sUSDS, legalDefenseFund),
  // Transfer USDC to Legal Defense Fund
  transferErc20(USDC, legalDefenseFund),

  // Transfer COW to Buyback Recipient
  transferErc20(COW, buyBack),
] satisfies PermissionList
