import { allow as allowAction } from "defi-kit/gno"
import { GNO, sDAI, USDC, USDT, WETH } from "@/addresses/gno"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Swap sDAI <-> [XDAI, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [sDAI],
    buy: ["XDAI", USDC, USDT],
    feeAmountBp: 200,
  }),
  allowAction.cowswap.swap({
    sell: ["XDAI", USDC, USDT],
    buy: [sDAI],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap GNO <-> WETH
  allowAction.cowswap.swap({
    sell: [GNO, WETH],
    buy: [GNO, WETH],
    feeAmountBp: 200,
  }),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
  // StakeWise v3 - Axol.io
  allowAction.stakewise_v3.stake({ targets: ["Axol.io"] }),
  // StakeWise v3 - Stakecat
  allowAction.stakewise_v3.stake({ targets: ["Stakecat"] }),
  // StakeWise v3 - SEEDNode
  allowAction.stakewise_v3.stake({ targets: ["SEEDNode"] }),
  // StakeWise v3 - Stakesaurus
  allowAction.stakewise_v3.stake({ targets: ["Stakesaurus SEA Home Nodes"] }),
]
