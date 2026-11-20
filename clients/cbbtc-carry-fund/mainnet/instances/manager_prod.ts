import { TODO_OPS } from "@/helpers"
import { Parameters } from "../parameters"

export const rolesMod = "0xbbE468a3eeC2c38543378A99e20255f23C790E67"
export const chainId = 1

export const parameters: Parameters = {
  avatar: "0xC1eb5AA95D7Ed67aE92f5d611628Ed0725e5D9f0",
  shares: "0xA9F836AfefAc083262113A7EF1FD01051Cd579bc",
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
