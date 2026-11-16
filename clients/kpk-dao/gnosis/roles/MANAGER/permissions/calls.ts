import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { WETH, wstETH } from "@/addresses/gno"
import { kpkEth } from "../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Bridge
   *********************************************/
  // Gnosis -> Mainnet (KPK DAO Safe on Ethereum)
  // GNO - Gnosis Bridge
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    kpkEth
  ),

  // WETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: WETH,
  },

  // wstETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: wstETH,
  },
] satisfies PermissionList
