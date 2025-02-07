import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { sDAI, USDC, USDCe, WXDAI, balancer } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerSwap } from "@/exit_strategies/balancer"
import { Parameters } from "../../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    /*********************************************
     * Swaps
     *********************************************/
    // Balancer - sDAI <-> USDC
    balancerSwap(balancer.sBal3Pid, [sDAI, USDC], [sDAI, USDC]),

    // Balancer - sDAI <-> USDC.e
    balancerSwap(balancer.sBAL3NewPid, [sDAI, USDCe], [sDAI, USDCe]),

    // Balancer - USDC <-> WXDAI
    balancerSwap(balancer.staBal3Pid, [USDC, WXDAI], [USDC, WXDAI]),

    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.deposit(),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.gnosis.navCalculator.bridgeStart(),

    // Bridge - Gnosis -> Mainnet
    // XDAI (Gnosis) -> DAI (Mainnet)
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
    // XDAI (Gnosis) -> DAI (Mainnet) - HOP
    allow.gnosis.hopDaiWrapper.swapAndSend(
      1, // Mainnet
      c.avatar
    ),

    // // COMP (Gnosis) -> COMP (Mainnet)
    // allow.gnosis.comp.transferAndCall(
    //   contracts.gnosis.xdaiBridge,
    //   undefined,
    //   avatar
    // ),

    // USDC (Gnosis) -> USDC (Mainnet)
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),
    // HOP does not work with USDC and USDC.e
  ] satisfies PermissionList
