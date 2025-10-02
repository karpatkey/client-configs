import { allow } from "zodiac-roles-sdk/kit"
import {
  EURe,
  GNO,
  SAFE,
  sDAI,
  USDC,
  USDCe,
  USDT,
  WBTC,
  WETH,
  wstETH,
  WXDAI,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowEthTransfer,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"
import {
  gnosisDaoIaGno,
  gnosisDaoLmGno,
  gnosisDaoLpGno,
  gnosisDaoIaEth,
  gpRewardsGno,
} from "../../../../../addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai["deposit"]({
    send: true,
  }),
  allow.gnosis.wxdai["withdraw"](),

  /*********************************************
   * Swaps
   *********************************************/
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
    gnosisDaoIaEth
  ),

  // SAFE - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: SAFE,
  },

  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    gnosisDaoIaEth
  ),

  // USDT - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: USDT,
  },

  // WBTC - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: WBTC,
  },

  // WETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: WETH,
  },

  // wstETH - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      gnosisDaoIaEth
    ),
    targetAddress: wstETH,
  },

  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(gnosisDaoIaEth, {
    send: true,
  }),

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer up to 500 GNO every 24 hours to gpRewardsGno
  allowErc20Transfer([GNO], [gpRewardsGno], "GNO_GP-REWARDS"),

  // Transfer XDAI between Gnosis DAO Safes
  allowEthTransfer(gnosisDaoIaGno),
  allowEthTransfer(gnosisDaoLmGno),
  allowEthTransfer(gnosisDaoLpGno),

  // Transfer [EURe, GNO, sDAI, USDC.e, WETH, wstETH, WXDAI] between Gnosis DAO Safes
  allowErc20Transfer(
    [EURe, GNO, sDAI, USDCe, WETH, wstETH, WXDAI],
    [gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno]
  ),
] satisfies PermissionList
