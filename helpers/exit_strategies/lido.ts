import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "../../eth-sdk/config"
import { PermissionList } from "../../types"
import { allowErc20Approve } from "../../utils/erc20"

export const lido__unstake_stETH = (): PermissionList => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.lido.stETH],
      [contracts.mainnet.lido.unstETH]
    ),

    // Request stETH Withdrawal - Locks your stETH in the queue. In exchange you receive an NFT, that represents your position
    // in the queue
    allow.mainnet.lido.unstETH["requestWithdrawals"](undefined, c.avatar),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable,
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unstETH["claimWithdrawals"](),
  ]
}

export const lidoExitStrategy2 = (): PermissionList => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.lido.wstETH],
      [contracts.mainnet.lido.unstETH]
    ),

    // Request wstETH Withdrawal - Transfers the wstETH to the unstETH to be burned in exchange for stETH. Then it locks your stETH
    // in the queue. In exchange you receive an NFT, that represents your position in the queue
    allow.mainnet.lido.unstETH["requestWithdrawalsWstETH"](undefined, c.avatar),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable,
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unstETH["claimWithdrawals"](),
  ]
}
