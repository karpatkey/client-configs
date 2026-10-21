import { TODO_OPS } from "@/helpers"
import { Parameters } from "../parameters"

export const rolesMod = "0x733D15743659f9F70a2aa031a0Ec566d62Fd470F"
export const chainId = 1

export const parameters: Parameters = {
  avatar: "0x7Bb5e307eDf80630f153BD28789b4365eFe4cce3",
  shares: "0x6D1a4C0878aD24793b1655ae1f78Cfa4522Ba765",
  // OIV settlement guard: ops choose every value (see the oiv-settlement-guard skill)
  settlementGuard: {
    sharesPriceMin: TODO_OPS,
    sharesPriceMax: TODO_OPS,
    callAllowance: {
      balance: TODO_OPS,
      maxRefill: TODO_OPS,
      refill: TODO_OPS,
      periodSeconds: TODO_OPS,
    },
  },
}
