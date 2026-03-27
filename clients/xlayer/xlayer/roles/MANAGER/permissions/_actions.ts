import { allow as allowAction } from "defi-kit/eth"
import {
  morpho,
} from "@/addresses/eth"

export default [
  // Morpho Vault - kpk USDT Prime v2
  allowAction.morphoVaults.deposit({
    targets: [morpho.kpkUsdtPrimeV2],
  }),
]
