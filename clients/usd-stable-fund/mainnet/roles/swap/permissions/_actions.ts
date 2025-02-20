import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, USDC } from "@/addresses/eth"

export default [
  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),
]
