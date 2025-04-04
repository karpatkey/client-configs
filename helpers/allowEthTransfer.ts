import { c } from "zodiac-roles-sdk"
import { FunctionPermission, TargetPermission } from "zodiac-roles-sdk"
import { Address } from "@gnosis-guild/eth-sdk"
import { encodeBytes32String } from "defi-kit"

export const allowEthTransferWithAnyData = (to: Address): TargetPermission => ({
  targetAddress: to,
  send: true,
})

export const allowEthTransfer = (
  to: Address,
  allowance?: string
): FunctionPermission => {
  if (allowance === "") {
    throw new Error("Invalid allowance key: empty string")
  }
  return {
    targetAddress: to,
    selector: "0x00000000",
    send: true,
    condition:
      allowance === undefined
        ? undefined
        : c.calldataMatches(
            [
              c.etherWithinAllowance(
                encodeBytes32String(allowance) as `0x${string}`
              ),
            ],
            []
          ),
  }
}
