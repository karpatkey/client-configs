import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@dethcrypto/eth-sdk"
import { sdks } from "../sdks"
import { ChainId } from "../../types"
// import { ethers } from "ethers"
// import { providers } from "../providers"

export const balancer__withdraw = (balancerPoolId: string): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}

export const balancer__unstake_withdraw = async (
  chainId: ChainId,
  gauge: Address
): Promise<PermissionSet> => {
  const sdk = sdks[chainId]

  const bpt = await sdk.balancer.gauge.attach(gauge).lp_token()
  const balancerPoolId = await sdk.balancer.bpt.attach(bpt).getPoolId()

  // Another way to do the same without the attach()
  // const provider = providers[chainId]

  // const gaugeContract = new ethers.Contract(
  //   gauge,
  //   sdk.balancer.gauge.interface.format(ethers.utils.FormatTypes.json),
  //   provider
  // )

  // const bpt = await gaugeContract.lp_token()

  // const bptContract = new ethers.Contract(
  //   bpt,
  //   sdk.balancer.bpt.interface.format(ethers.utils.FormatTypes.json),
  //   provider
  // )

  // const balancerPoolId = await bptContract.getPoolId()

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
