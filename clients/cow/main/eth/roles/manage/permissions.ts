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
import { avatar as twap } from "../../../../twap/eth"
import { legalDefenseFund } from "../../../eth"
import { PermissionList } from "../../../../../../types"
import { allowErc20Transfer } from "../../../../../../helpers/erc20"

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
  // Transfer sDAI, sUSDS,USDC to Legal Defense Fund
  allowErc20Transfer([sDAI, sUSDS, USDC], [legalDefenseFund]),

  // Transfer COW, USDC, WETH to TWAP Safe
  allowErc20Transfer([COW, USDC, WETH], [twap]),
] satisfies PermissionList
