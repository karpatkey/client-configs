import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@gnosis-guild/eth-sdk"

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

export const auraWithdrawBalancer = (
  rewarder: Address,
  balancerPoolId: string,
  allowExitOneCoin: boolean = true
): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
      targetAddress: rewarder,
    },
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancerV2.vault.exitPool(
      balancerPoolId,
      c.avatar,
      c.avatar,
      {
        userData: c.abiEncodedMatches(
          allowExitOneCoin
            ? [c.pass] // Constraint if allowExitOneCoin = true
            : [c.or(1, 2, 3)], // Constraint if allowExitOneCoin = false
          ["uint256"]
        ),
      }
    ),
  ]
}
