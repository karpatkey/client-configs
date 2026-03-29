import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  ETHPlus,
  ezETH,
  GEAR,
  KING,
  MORPHO,
  rETH,
  RPL,
  rsETH,
  stETH,
  USDC,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  // CowSwap - [AURA, BAL, ETHPlus, ezETH, GEAR, KING, MORPHO, rETH, RPL, rsETH, stETH, USDC, weETH, WETH, wstETH] -> [WETH]
  allowAction.cowswap.swap({
    sell: [
      AURA,
      BAL,
      ETHPlus,
      ezETH,
      GEAR,
      KING,
      MORPHO,
      rETH,
      RPL,
      rsETH,
      stETH,
      USDC,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [WETH],
  }),
]
