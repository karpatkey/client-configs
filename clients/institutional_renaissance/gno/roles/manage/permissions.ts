import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  GNO,
  osGNO,
  sDAI,
  USDC,
  USDCe,
  WXDAI,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - [GNO, osGNO, sDAI, USDC, USDC.e, WXDAI, xDAI] -> [GNO, osGNO, sDAI, USDC, USDC.e, WXDAI, xDAI]
  allowAction.cowswap.swap({
    sell: ["XDAI", GNO, osGNO, sDAI, USDC, USDCe, WXDAI],
    buy: ["XDAI", GNO, osGNO, sDAI, USDC, USDCe, WXDAI],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  // StakeWise v3 - Genesis
  allowAction.stakewise_v3.stake({ targets: ["Genesis Vault"] }),
  // StakeWise v3 - Serenita
  allowAction.stakewise_v3.stake({ targets: ["Serenita"] }),
  // StakeWise v3 - NEDO
  allowAction.stakewise_v3.stake({ targets: ["NEDO"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  /*********************************************
   * Swaps
   *********************************************/
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

  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),

  // GNO (Gnosis) -> GNO (Mainnet)
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),
] satisfies PermissionList
