import { c } from "zodiac-roles-sdk"
import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import { zeroAddress } from "@/addresses"
import { BAL, COW, CRV, GHO, GNO, SAFE, USDC, USDCe, USDT, WBTC, WETH, wstETH, WXDAI } from "@/addresses/gno"
import { allowErc20Approve, allowErc20Transfer, allowEthTransfer } from "@/helpers"
import { kpkEth, kfPaymentsGC } from "../../../addresses"
import { vcbGc } from "../../../../mainnet/addresses"

export default [
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

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
  // BAL - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: BAL,
  },

  // COW - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: COW,
  },

  // CRV - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: CRV,
  },

  // GHO - Chainlink - transporter.io
  allowErc20Approve([GHO], [contracts.gnosis.chainlink.router]),
  allow.gnosis.chainlink.router.ccipSend(
    "5009297550715157269", // https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
    {
      receiver: "0x" + kpkEth.slice(2).padStart(64, "0"),
      data: "0x",
      // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
      tokenAmounts: c.matches([
        {
          token: GHO,
          amount: undefined,
        },
      ]),
      feeToken: zeroAddress,
      // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#generic_extra_args_v2_tag
      // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#genericextraargsv2
      extraArgs: c.or(
        "0x",
        "0x181dcf1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
      ),
    },
    {
      send: true,
    }
  ),

  // GNO - Gnosis Bridge
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    kpkEth
  ),

  // SAFE - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: SAFE,
  },

  // USDC - Gnosis Bridge
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.gnosisBridge.xdaiBridge,
    undefined,
    kpkEth
  ),

  // USDT - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: USDT,
  },

  // WBTC - Gnosis Bridge
  {
    ...allow.gnosis.gno.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      kpkEth
    ),
    targetAddress: WBTC,
  },

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

  // XDAI -> DAI - Gnosis Bridge
  allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(kpkEth, {
    send: true,
  }),
  // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.

  /*********************************************
   * Transfers
   *********************************************/
  // Transfer 200 GNO per month to kfPaymentsGC
  allowErc20Transfer([GNO], [kfPaymentsGC], "GNO_KF-PAYMENTS-GC"),

  // Transfer 600K xDAI per month to vcbGC
  allowEthTransfer(vcbGc, "XDAI_VCBGC-GC"),

  // Transfer 600K WXDAI per month to vcbGC
  allowErc20Transfer([WXDAI], [vcbGc], "XDAI_VCBGC-GC"),
] satisfies PermissionList
