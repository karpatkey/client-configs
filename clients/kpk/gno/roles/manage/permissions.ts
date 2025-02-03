import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { CRV, USDC, USDT, sDAI, WETH, wstETH, WXDAI } from "@/addresses/gno"
import { eAddress } from "@/addresses"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - [USDC, USDT, sDAI] -> [USDC, USDT, WETH, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: [USDC, USDT, sDAI],
    buy: [eAddress, USDC, USDT, WETH, WXDAI],
  }),
  // CowSwap - WXDAI -> [USDC, USDT, WETH]
  allowAction.cowswap.swap({
    sell: [WXDAI],
    buy: [USDC, USDT, WETH],
  }),
  // CowSwap - wstETH -> WETH
  allowAction.cowswap.swap({
    sell: [wstETH],
    buy: [WETH],
  }),
  // CowSwap - CRV -> [USDC, WXDAI, XDAI]
  allowAction.cowswap.swap({
    sell: [CRV],
    buy: [eAddress, USDC, WXDAI],
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),
] satisfies PermissionList
