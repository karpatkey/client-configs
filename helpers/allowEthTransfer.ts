import { FunctionPermission, TargetPermission } from "zodiac-roles-sdk"
import { Address } from "@gnosis-guild/eth-sdk"

export const allowEthTransferWithAnyData = (to: Address): TargetPermission => ({
  targetAddress: to,
  send: true,
})

export const allowEthTransfer = (to: Address): FunctionPermission => ({
  targetAddress: to,
  selector: "0x00000000",
  send: true,
})
