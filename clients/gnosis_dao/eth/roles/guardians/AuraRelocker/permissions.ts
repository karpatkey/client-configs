import { allow } from "zodiac-roles-sdk/kit"
import { AURA } from "../../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../../utils/erc20"
import { PermissionList } from "../../../../../../types"

export default [
  allowErc20Approve([AURA], [contracts.mainnet.aura.claimZapV3]),
  allow.mainnet.aura.claimZapV3.claimRewards(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      claimCvxCrv: undefined,
      claimLockedCvx: undefined,
      lockCvxCrv: false,
      lockCrvDeposit: false,
      useAllWalletFunds: false,
      useCompounder: false,
      lockCvx: true,
    }
  ),
] satisfies PermissionList
