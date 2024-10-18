import { PermissionSet } from "zodiac-roles-sdk"
import { allow as allowActionEth } from "defi-kit/eth"
import { allow as allowActionGno } from "defi-kit/gno"
import { allow as allowActionArb } from "defi-kit/arb1"
import { Chain } from "../../types"
import { Address } from "@dethcrypto/eth-sdk"

export const cowswap__swap = async (
  sell: Address[],
  buy: Address[],
  chain: Chain
): Promise<PermissionSet> => {
  switch (chain) {
    case Chain.eth:
      return await allowActionEth.cowswap.swap({ sell: sell, buy: buy })

    case Chain.gno:
      return await allowActionGno.cowswap.swap({ sell: sell, buy: buy })

    case Chain.arb1:
      return await allowActionArb.cowswap.swap({ sell: sell, buy: buy })

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

