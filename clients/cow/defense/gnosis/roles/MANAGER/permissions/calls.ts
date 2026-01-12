import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { USDC, USDT, WETH } from "@/addresses/gno"
import { mainTreasury } from "../../../../../addresses"
import { PermissionList } from "@/types"
import { allowEthTransfer, allowErc20Transfer } from "@/helpers"
import { contracts } from "@/contracts"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Transfers
     *********************************************/
    // Transfer XDAI to the Main Treasury
    allowEthTransfer(mainTreasury),
  
    // Transfer USDC and USDT to the Main Treasury
    allowErc20Transfer([USDC, USDT], [mainTreasury]),

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

    // USDT - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: USDT,
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

    // XDAI -> DAI - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // XDAI -> USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.usdsDeposit.relayTokens(c.avatar, { send: true }),
  ] satisfies PermissionList
