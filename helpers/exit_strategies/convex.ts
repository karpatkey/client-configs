import { PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@dethcrypto/eth-sdk"

export const convex__withdraw = (rewarder: Address): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
      targetAddress: rewarder,
    },
    {
      ...allow.mainnet.convex.rewarder.withdraw(),
      targetAddress: rewarder,
    },
  ]
}
