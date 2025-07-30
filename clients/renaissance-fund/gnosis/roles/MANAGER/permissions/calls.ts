import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { USDCe } from "@/addresses/gno"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Swaps
     *********************************************/
    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // USDC - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
  ] satisfies PermissionList
