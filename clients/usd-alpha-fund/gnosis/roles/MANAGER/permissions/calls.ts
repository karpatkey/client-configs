import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
import { GHO, USDC, USDCe } from "@/addresses/gno"
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

    /*********************************************
     * Bridges
     *********************************************/
    // Gnosis Chain -> Mainnet
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.gnosis.chainlink.router]),
    allow.gnosis.chainlink.router.ccipSend(
      "5009297550715157269", // https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
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

    // USDC - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.gnosisBridge.xdaiBridge,
      undefined,
      parameters.avatar
    ),
    // No claim is required for the USDC bridged from Mainnet via Gnosis Bridge.

    // USDC.e -> USDC - Stargate
    allowErc20Approve([USDCe], [contracts.gnosis.stargate.poolUsdc]),
    allow.gnosis.stargate.poolUsdc.send(
      {
        dstEid: "30101", // Mainnet chain ID
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        // 0x = default / no LayerZero options
        // 0x0003 = empty LayerZero TYPE_3 options container (OptionsBuilder.newOptions())
        // https://github.com/LayerZero-Labs/LayerZero-v2/blob/9c741e7f9790639537b1710a203bcdfd73b0b9ac/packages/layerzero-v2/evm/oapp/contracts/oapp/libs/OptionsBuilder.sol#L22
        extraOptions: c.or("0x", "0x0003"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"), // https://docs.stargate.finance/developers/protocol-docs/transfer#sendparamoftcmd
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),

    // XDAI -> DAI - Gnosis Bridge
    allow.gnosis.gnosisBridge.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),
    // No claim is required for the DAI bridged from Mainnet via Gnosis Bridge.

    // XDAI -> USDS - Gnosis Bridge
    allow.gnosis.gnosisBridge.usdsDeposit.relayTokens(c.avatar, { send: true }),
    // No claim is required for the USDS bridged from Mainnet via Gnosis Bridge.

    // Gnosis Chain -> Arbitrum
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.gnosis.chainlink.router]),
    allow.gnosis.chainlink.router.ccipSend(
      "4949039107694359620", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-arbitrum-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
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

    // Gnosis Chain -> Base
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.gnosis.chainlink.router]),
    allow.gnosis.chainlink.router.ccipSend(
      "15971525489660198786", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-base-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
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
  ] satisfies PermissionList
