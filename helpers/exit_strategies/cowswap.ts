import { allow as allowActionEth } from "defi-kit/eth"
import { allow as allowActionGno } from "defi-kit/gno"
import { allow as allowActionArb } from "defi-kit/arb1"
import { PermissionList, Chain } from "../../types"
import { Address } from "@dethcrypto/eth-sdk"

export const cowswap__swap = (
  sell: Address,
  buy: Address,
  chain: Chain
): PermissionList => {
  switch (chain) {
    case Chain.eth:
      return [allowActionEth.cowswap.swap({ sell: [sell], buy: [buy] })]

    case Chain.gno:
      return [allowActionGno.cowswap.swap({ sell: [sell], buy: [buy] })]

    case Chain.arb1:
      return [allowActionArb.cowswap.swap({ sell: [sell], buy: [buy] })]

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}
