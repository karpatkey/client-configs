import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Bridge - Gnosis -> Mainnet
    // XDAI (Gnosis) -> DAI (Mainnet)
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // GNO (Gnosis) -> GNO (Mainnet)
    allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
  ] satisfies PermissionList
