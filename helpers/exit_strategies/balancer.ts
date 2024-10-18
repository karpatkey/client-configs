import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@dethcrypto/eth-sdk"
import { sdks } from "../sdks"
import { Chain } from "../../types"
import { allowErc20Approve } from "../../utils/erc20"
import { contracts } from "../../eth-sdk/config"
// import { ethers } from "ethers"
// import { providers } from "../providers"

export const balancer__withdraw = (balancerPoolId: string): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}

export const balancer__unstake_withdraw = async (
  chain: Chain,
  gauge: Address
): Promise<PermissionSet> => {
  const sdk = sdks[chain]

  const bpt = await sdk.balancer.gauge.attach(gauge).lp_token()
  const balancerPoolId = await sdk.balancer.bpt.attach(bpt).getPoolId()

  // Another way to do the same without the attach()
  // const provider = providers[chain]

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

export const balancer__swap = (
  balancerPoolId: string,
  assetsIn: Address[],
  assetsOut: Address[]
): PermissionSet => {
  return [
    ...allowErc20Approve(assetsIn, [contracts.mainnet.balancer.vault]),
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancer.vault.swap(
      {
        poolId: balancerPoolId,
        assetIn: c.or(...(assetsIn as [Address, Address, ...Address[]])),
        assetOut: c.or(...(assetsOut as [Address, Address, ...Address[]])),
      },
      {
        recipient: c.avatar,
        sender: c.avatar,
      }
    ),
  ]
}
