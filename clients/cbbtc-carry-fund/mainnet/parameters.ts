import { SettlementGuard } from "@/helpers"

export interface Parameters {
  avatar: `0x${string}`
  shares: `0x${string}`
  /** OIV settlement guard on the settlement bot's role (manager instances only). */
  settlementGuard?: SettlementGuard
}
