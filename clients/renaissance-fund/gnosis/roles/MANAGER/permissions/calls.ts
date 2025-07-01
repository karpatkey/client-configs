import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
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
