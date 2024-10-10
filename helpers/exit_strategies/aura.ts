import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@dethcrypto/eth-sdk"

export const aura__withdraw = (rewarder: Address): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
      targetAddress: rewarder,
    },
  ]
}

export const aura__withdraw_balancer = (
  rewarder: Address,
  balancerPoolId: string
): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
      targetAddress: rewarder,
    },
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}
