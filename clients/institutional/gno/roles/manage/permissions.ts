import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  sDAI,
  USDC,
  USDCe,
  WXDAI,
  E_ADDRESS,
  balancer,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"
import { balancer__swap } from "../../../../../helpers/exit_strategies/balancer"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),
  // Aave v3 - Borrow WXDAI
  allowAction.aave_v3.borrow({ targets: ["WXDAI"] }),
  // Aave v3 - Borrow XDAI
  allowAction.aave_v3.borrow({ targets: ["XDAI"] }),

  // CowSwap - [sDAI, USDC, USDCe, WXDAI] -> [E_ADDRESS, sDAI, USDC, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: [E_ADDRESS, sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Deposit USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),
  // Spark - Deposit WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - Deposit XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),
  // Spark - Borrow WXDAI
  allowAction.spark.borrow({ targets: ["WXDAI"] }),
  // Spark - Borrow XDAI
  allowAction.spark.borrow({ targets: ["XDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - USDT/sDAI/USDC Pool - Swap sDAI <-> USDC
  balancer__swap(balancer.sBAL3_pId, [sDAI, USDC], [sDAI, USDC]),

  // Balancer - USDT/sDAI/USDC.e pool - Swap sDAI <-> USDC.e
  balancer__swap(balancer.sBAL3_2_pId, [sDAI, USDCe], [sDAI, USDCe]),

  // Balancer - USDT/USDC/WXDAI pool - Swap USDC <-> WXDAI
  balancer__swap(balancer.staBAL3_pId, [USDC, WXDAI], [USDC, WXDAI]),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdai_bridge_2.relayTokens(c.avatar, {
    send: true,
  }),
  // XDAI (Gnosis) -> DAI (Mainnet) - HOP
  allow.gnosis.hop_dai_wrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),

  // // COMP (Gnosis) -> COMP (Mainnet)
  // allow.gnosis.comp.transferAndCall(
  //   contracts.gnosis.xdai_bridge,
  //   undefined,
  //   avatar
  // ),

  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    avatar
  ),
  // HOP does not work with USDC and USDC.e
] satisfies PermissionList
