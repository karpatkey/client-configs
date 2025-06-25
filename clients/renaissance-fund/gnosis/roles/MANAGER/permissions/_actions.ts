import { allow as allowAction } from "defi-kit/gno"
import { GNO, osGNO, USDCe } from "@/addresses/gno"

export default [
  // CowSwap - [GNO, osGNO, USDC.e] <-> [GNO, osGNO, USDC.e]
  allowAction.cowswap.swap({
    sell: [GNO, osGNO, USDCe],
    buy: [GNO, osGNO, USDCe],
  }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),
]
