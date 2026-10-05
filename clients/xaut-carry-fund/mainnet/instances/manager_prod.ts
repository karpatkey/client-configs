import { TODO_OPS } from "@/helpers"
import { Parameters } from "../parameters"

export const rolesMod = "0x6E00e2da1266157E0f8899890fa18bD2BF7b5A75"
export const chainId = 1

export const parameters: Parameters = {
  avatar: "0xE0CCE55E47c39a49D79B2EE4eDea623668596C77",
  shares: "0xDa35793Dc733fEFfb294938F95ff3B593170f9F8",
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
