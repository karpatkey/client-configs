import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { contracts } from "@/contracts"
import {
  EURe,
  USDC,
  USDCe,
  USDT,
  WBTC,
  WETH,
  wstETH,
  WXDAI,
  x3CRV,
  curve,
} from "@/addresses/gno"
import { allowErc20Approve, allowEthTransfer } from "@/helpers"
import { legalDefenseFund } from "../../../../../addresses"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    // Curve - EURe/x3CRV
    allowErc20Approve([EURe, x3CRV], [contracts.gnosis.curve.crvEureUsdPool]),
    allow.gnosis.curve.crvEureUsdPool["add_liquidity(uint256[2],uint256)"](),
    allow.gnosis.curve.crvEureUsdPool["remove_liquidity(uint256,uint256[2])"](),
    allow.gnosis.curve.crvEureUsdPool[
      "remove_liquidity_one_coin(uint256,uint256,uint256)"
    ](),
    allowErc20Approve(
      [EURe, USDC, USDT, WXDAI],
      [contracts.gnosis.curve.crvEureUsdZap]
    ),
    allow.gnosis.curve.crvEureUsdZap["add_liquidity(uint256[4],uint256)"](),
    allow.gnosis.curve.crvEureUsdZap["remove_liquidity(uint256,uint256[4])"](),
    allow.gnosis.curve.crvEureUsdZap[
      "remove_liquidity_one_coin(uint256,uint256,uint256)"
    ](),
    allowErc20Approve(
      [curve.crvEureUsd],
      [contracts.gnosis.curve.crvEureUsdGauge]
    ),
    allow.gnosis.curve.crvEureUsdGauge["deposit(uint256)"](),
    allow.gnosis.curve.crvEureUsdGauge["withdraw(uint256)"](),
    allow.gnosis.curve.crvEureUsdGauge["claim_rewards()"](),

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
     * Transfers
     *********************************************/
    // Transfer XDAI to CoW Defense Fund
    allowEthTransfer(legalDefenseFund),

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

    // WETH -> ETH - Stargate
    allowErc20Approve([WETH], [contracts.gnosis.stargate.poolNative]),
    allow.gnosis.stargate.poolNative.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),

    // wstETH - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.gnosisBridge.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: wstETH,
    },

    // XDAI -> DAI - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // XDAI -> USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.usdsDeposit.relayTokens(c.avatar, { send: true }),
  ] satisfies PermissionList
