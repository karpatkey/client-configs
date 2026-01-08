import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { WETH, wstETH } from "@/addresses/gno"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // WETH - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: WETH,
    },

    // wstETH - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: wstETH,
    },
  ] satisfies PermissionList
