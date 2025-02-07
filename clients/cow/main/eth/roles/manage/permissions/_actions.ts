import { allow as allowAction } from "defi-kit/eth"
import { DAI, sDAI, sUSDS, USDC, USDT, WETH } from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - [DAI, ETH, USDC, USDT, WETH] -> [ETH, sDAI, sUSDS, WETH]
  allowAction.cowswap.swap({
    sell: ["ETH", DAI, USDC, USDT, WETH],
    buy: ["ETH", sDAI, sUSDS, WETH],
  }),
]
