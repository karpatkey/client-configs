import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { USDC, USDCe, USDT, WBTC, WETH } from "@/addresses/gno"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Swap USDC.e -> USDC
    allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
    allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    allowErc20Approve([USDC], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
    allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),

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

    // XDAI -> USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // XDAI -> USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.usdsDeposit.relayTokens(c.avatar, { send: true }),
  ] satisfies PermissionList
