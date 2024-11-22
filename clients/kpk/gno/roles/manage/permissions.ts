import { PermissionList } from "../../../../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  CRV,
  USDC,
  USDT,
  sDAI,
  WETH,
  wstETH,
  WXDAI,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [USDC, USDT, sDAI],
    buy: [E_ADDRESS, USDC, USDT, WETH, WXDAI],
  }),
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [USDC, USDT, WETH],
  }),
  allowAction.cowswap.swap({
    sell: [wstETH],
    buy: [WETH],
  }),
  allowAction.cowswap.swap({
    sell: [CRV],
    buy: [E_ADDRESS, USDC, WXDAI],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
] satisfies PermissionList
