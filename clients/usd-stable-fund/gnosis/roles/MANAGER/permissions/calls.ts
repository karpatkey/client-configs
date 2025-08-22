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
    ...allowErc20Approve(
      [USDCe],
      [contracts.gnosis.gnosisBridge.usdcTransmuter]
    ),
    allow.gnosis.gnosisBridge.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve(
      [USDC],
      [contracts.gnosis.gnosisBridge.usdcTransmuter]
    ),
    allow.gnosis.gnosisBridge.usdcTransmuter.deposit(),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet
    // XDAI -> DAI - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
    // XDAI -> DAI  - HOP
    allow.gnosis.hop.hopDaiWrapper.swapAndSend(
      1, // Mainnet
      c.avatar
    ),

    // // COMP (Gnosis) -> COMP (Mainnet)
    // allow.gnosis.comp.transferAndCall(
    //   contracts.gnosis.xdaiBridge,
    //   undefined,
    //   avatar
    // ),

    // USDC - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),
    // HOP does not work with USDC and USDC.e
  ] satisfies PermissionList
