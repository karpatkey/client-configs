import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"

export const lidoUnstakeStEth = (): PermissionSet => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.lido.stEth],
      [contracts.mainnet.lido.unstEth]
    ),

    // Request stETH Withdrawal - Locks your stETH in the queue. In exchange you receive an NFT, that represents your position
    // in the queue
    allow.mainnet.lido.unstEth["requestWithdrawals"](undefined, c.avatar),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable,
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unstEth["claimWithdrawals"](),
  ]
}

export const lidoUnwrapAndUnstakeWstEth = (): PermissionSet => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.lido.wstEth],
      [contracts.mainnet.lido.unstEth]
    ),

    // Request wstETH Withdrawal - Transfers the wstETH to the unstETH to be burned in exchange for stETH. Then it locks your stETH
    // in the queue. In exchange you receive an NFT, that represents your position in the queue
    allow.mainnet.lido.unstEth["requestWithdrawalsWstETH"](undefined, c.avatar),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable,
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unstEth["claimWithdrawals"](),
  ]
}
