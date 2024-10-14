import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../../types"

export default [
  allow.mainnet.aura.claim_zap.claimRewards(
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
  )
] satisfies PermissionList
