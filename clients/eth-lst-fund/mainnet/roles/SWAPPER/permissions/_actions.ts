import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  cbETH,
  CRV,
  CVX,
  eETH,
  ETHFI,
  ETHx,
  osETH,
  rETH,
  RPL,
  stETH,
  SWISE,
  weETH,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { contracts } from "@/contracts"

export default [
  // CowSwap - [ankrETH, AURA, BAL, cbETH, CRV, CVX, eETH, ETH, ETHFI, ETHx, liquidETH, osETH, rETH, RPL, stETH, SWISE, weETH, WETH, wstETH] ->
  // [ankrETH, cbETH, eETH, ETH, ETHx, liquidETH, osETH, rETH, stETH, weETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [
      ankrETH,
      AURA,
      BAL,
      cbETH,
      CRV,
      CVX,
      eETH,
      "ETH",
      ETHFI,
      ETHx,
      contracts.mainnet.etherfi.liquidEth,
      osETH,
      rETH,
      RPL,
      stETH,
      SWISE,
      weETH,
      WETH,
      wstETH,
    ],
    buy: [
      ankrETH,
      cbETH,
      eETH,
      "ETH",
      ETHx,
      contracts.mainnet.etherfi.liquidEth,
      osETH,
      rETH,
      stETH,
      weETH,
      WETH,
      wstETH,
    ],
  }),
]
