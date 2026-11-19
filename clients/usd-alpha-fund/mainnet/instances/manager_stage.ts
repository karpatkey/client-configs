import { TODO_OPS } from "@/helpers"
import { Parameters } from "../parameters"

export const rolesMod = "0xeC0C907DA1df3331F76C361FC4F5Ad6c4e643B46"
export const chainId = 1

export const parameters: Parameters = {
  avatar: "0xc9bf24C05131495d1A1e96Cb00F9F9a315B97978",
  shares: "0x097774aEB590128fBfA22E598F2A4D7FD49D1EFa",
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
