import { allow } from "zodiac-roles-sdk/kit"
import { COW, DAI, sDAI, sUSDS, USDC, USDT, WETH } from "@/addresses/eth"
import { legalDefenseFund, twapAvatar } from "../../../../../addresses"
import { PermissionList } from "@/types"
import { allowErc20Transfer } from "@/helpers"

export default [
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
  allowErc20Transfer([COW, USDC, WETH], [twapAvatar]),
] satisfies PermissionList
