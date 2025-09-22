import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { USDCe } from "@/addresses/gno"
import { PermissionList } from "@/types"
import { kpkGovernance, snapshotGnosisId } from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Gnosis - Delegate/Undelgate GNO on Snapshot
    allow.mainnet.snapshot.delegation.setDelegate(
      snapshotGnosisId,
      kpkGovernance
    ),
    allow.mainnet.snapshot.delegation.clearDelegate(snapshotGnosisId),
    
    /*********************************************
     * Swaps
     *********************************************/
    // Swap USDC.e -> USDC
    allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
    allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // USDC - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),
  ] satisfies PermissionList
