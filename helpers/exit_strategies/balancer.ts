import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../types"
import { Address } from "@dethcrypto/eth-sdk"

export const balancer__withdraw = (balancerPoolId: string): PermissionList => {
  return [
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}

export const balancer__unstake_withdraw = (
  balancerPoolId: string,
  gauge: Address
): PermissionList => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
      targetAddress: gauge,
    },
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}
