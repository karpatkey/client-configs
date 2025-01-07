import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COW,
  DAI,
  sDAI,
  sUSDS,
  USDC,
  USDT,
  WETH,
} from "../../../../../../eth-sdk/addresses"
import { transferErc20 } from "../../../../../../helpers/transfers"
import { avatar as twap } from "../../../../twap/eth"
import { legalDefenseFund } from "../../../eth"
import { PermissionList } from "../../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - [DAI, ETH, USDC, USDT, WETH] -> [ETH, sDAI, sUSDS, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", DAI, USDC, USDT, WETH],
    buy: ["ETH", sDAI, sUSDS, WETH],
  }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer sDAI to Legal Defense Fund
  transferErc20(sDAI, legalDefenseFund),
  // Transfer sUSDS to Legal Defense Fund
  transferErc20(sUSDS, legalDefenseFund),
  // Transfer USDC to Legal Defense Fund
  transferErc20(USDC, legalDefenseFund),

  // Transfer COW to TWAP Safe
  transferErc20(COW, twap),
  // Transfer USDC to TWAP Safe
  transferErc20(USDC, twap),
  // Transfer WETH to TWAP Safe
  transferErc20(WETH, twap),
] satisfies PermissionList
