import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDCe } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    // Swap USDC.e -> USDC
    allowErc20Approve([USDCe], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
    allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    allowErc20Approve([USDC], [contracts.gnosis.gnosisBridge.usdcTransmuter]),
    allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),
  ] satisfies PermissionList
