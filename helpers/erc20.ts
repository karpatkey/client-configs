import { c, forAll } from "zodiac-roles-sdk"
import { encodeBytes32String } from "defi-kit"

export const allowErc20Approve = (
  tokens: readonly `0x${string}`[],
  spenders: readonly `0x${string}`[]
) =>
  forAll(tokens, {
    signature: "approve(address,uint256)",
    condition: c.calldataMatches(
      [
        spenders.length === 1
          ? spenders[0]
          : c.or(...(spenders as [string, string, ...string[]])),
      ],
      ["address", "uint256"]
    ),
  })

export const allowErc20Transfer = (
  tokens: readonly `0x${string}`[],
  recipients: readonly `0x${string}`[],
  allowance?: string
) => {
  if (allowance === "") {
    throw new Error("Invalid allowance key: empty string")
  }
  return forAll(tokens, {
    signature: "transfer(address,uint256)",
    condition: c.calldataMatches(
      [
        recipients.length === 1
          ? recipients[0]
          : c.or(...(recipients as [string, string, ...string[]])),
        allowance === undefined
          ? undefined
          : c.withinAllowance(encodeBytes32String(allowance) as `0x${string}`),
      ],
      ["address", "uint256"]
    ),
  })
}
