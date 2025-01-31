import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  sDAI,
  USDC,
  USDCe,
  WXDAI,
  eAddress,
  balancer,
} from "../../../../../eth-sdk/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"
import { balancerSwap } from "@/exit_strategies/balancer"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
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

  // CowSwap - [sDAI, USDC, USDCe, WXDAI] -> [ETH, sDAI, USDC, USDCe, WXDAI]
  allowAction.cowswap.swap({
    sell: [sDAI, USDC, USDCe, WXDAI],
    buy: [eAddress, sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR_sDAI
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

  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),
  // HOP does not work with USDC and USDC.e
] satisfies PermissionList
