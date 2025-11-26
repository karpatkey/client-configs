import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { USDT, WBTC, WETH } from "@/addresses/gno"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // GNO - Gnosis Bridge
    allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // USDC - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // USDT - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: USDT,
    },

    // WBTC - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: WBTC,
    },

    // WETH - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: WETH,
    },

    // XDAI -> DAI/USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
  ] satisfies PermissionList
