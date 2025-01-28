import { TargetPermission } from "zodiac-roles-sdk"
import { Address } from "@gnosis-guild/eth-sdk"

export const allowEthTransfer = (to: Address): TargetPermission => ({
  targetAddress: to,
  send: true,
})
