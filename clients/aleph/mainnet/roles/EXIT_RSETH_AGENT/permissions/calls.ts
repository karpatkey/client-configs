import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { eAddress } from "@/addresses"
import { ETHx, rsETH, stETH } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 - Withdraw rsETH to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(rsETH, undefined, c.avatar),

    // Kelp - Approve rsETH to the WithdrawalManager
    allowErc20Approve([rsETH], [contracts.mainnet.kelp.lrtWithdrawalManager]),

    // Kelp - Initiate withdrawal redeeming for ETH, ETHx or stETH
    allow.mainnet.kelp.lrtWithdrawalManager.initiateWithdrawal(
      c.or(eAddress, ETHx, stETH)
    ),
  ] satisfies PermissionList
