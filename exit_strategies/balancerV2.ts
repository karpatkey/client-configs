import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@gnosis-guild/eth-sdk"
import { sdks } from "../helpers/sdks"
import { Chain } from "@/types"
import { allowErc20Approve } from "@/helpers"
import { contracts } from "@/contracts"
// import { ethers } from "ethers"
// import { providers } from "../providers"

export const balancerV2Withdraw = (
  balancerPoolId: string,
  allowExitOneCoin: boolean = true
): PermissionSet => {
  return [
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

export const balancerV2UnstakeWithdraw = async (
  chain: Chain,
  gauge: Address,
  allowExitOneCoin: boolean = true
): Promise<PermissionSet> => {
  const sdk = sdks[chain]

  const bpt = await sdk.balancerV2.gauge.attach(gauge).lp_token()
  const balancerPoolId = await sdk.balancerV2.bpt.attach(bpt).getPoolId()

  // Another way to do the same without the attach()
  // const provider = providers[chain]

  // const gaugeContract = new ethers.Contract(
  //   gauge,
  //   sdk.balancerV2.gauge.interface.format(ethers.utils.FormatTypes.json),
  //   provider
  // )

  // const bpt = await gaugeContract.lp_token()

  // const bptContract = new ethers.Contract(
  //   bpt,
  //   sdk.balancerV2.bpt.interface.format(ethers.utils.FormatTypes.json),
  //   provider
  // )

  // const balancerPoolId = await bptContract.getPoolId()

  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: gauge,
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

export const balancerV2Swap = (
  balancerPoolId: string,
  assetsIn: Address[],
  assetsOut: Address[]
): PermissionSet => {
  return [
    ...allowErc20Approve(assetsIn, [contracts.mainnet.balancerV2.vault]),
    // It doesn't matter the blockchain we use, as the Vault address remains the same
    allow.mainnet.balancerV2.vault.swap(
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
