import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { sDAI, USDC, USDCe, WXDAI, balancerV2 } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    /*********************************************
     * Swaps
     *********************************************/
    // Balancer - sDAI <-> USDC
    balancerV2Swap(balancerV2.sBal3Pid, [sDAI, USDC], [sDAI, USDC]),

    // Balancer - sDAI <-> USDC.e
    balancerV2Swap(balancerV2.sBAL3NewPid, [sDAI, USDCe], [sDAI, USDCe]),

    // Balancer - USDC <-> WXDAI
    balancerV2Swap(balancerV2.staBal3Pid, [USDC, WXDAI], [USDC, WXDAI]),

    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.deposit(),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // XDAI (Gnosis) -> DAI (Mainnet) - Gnosis Bridge
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
    // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.

    // XDAI (Gnosis) -> DAI (Mainnet) - HOP
    allow.gnosis.hopDaiWrapper.swapAndSend(
      1, // Mainnet
      c.avatar
    ),

    // USDC (Gnosis) -> USDC (Mainnet)
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar // TODO this should use c.avatar
    ),
    // HOP does not work with USDC and USDC.e
  ] satisfies PermissionList
