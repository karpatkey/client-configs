import { TODO_OPS } from "@/helpers"
import { Parameters } from "../parameters"

export const rolesMod = "0x5A64ce3610Cd2835FC4dC52F9679e50969458022"
export const chainId = 1

export const parameters: Parameters = {
  avatar: "0x5d48084481660C97DecDEFE65482fD091d7FDe81",
  shares: "0xf180800f239f0ea0ED2F8156581fac2984cEe389",
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
