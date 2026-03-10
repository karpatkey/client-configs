import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
import { COMP, syrupUSDC, USDC, USDT } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../arbitrum/parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Arbitrum
    // COMP - Claim bridged from Arbitrum
    allow.mainnet.arbitrumBridge.outbox4.executeTransaction(
      undefined,
      undefined,
      contracts.arbitrumOne.arbitrumBridge.l2Erc20Gateway, // Origin address
      contracts.mainnet.arbitrumBridge.l1Erc20Gateway, // Destination address
      undefined,
      undefined,
      undefined,
      undefined,
      c.calldataMatches(
        allow.mainnet.arbitrumBridge.l1Erc20Gateway.finalizeInboundTransfer(
          COMP,
          c.avatar,
          c.avatar,
          undefined,
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F6#L116
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F15#L58
          // The callHookData should be scoped to 0x to prevent any unwanted data from being included
          c.or(
            c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"]),
            "0x"
          )
        )
      )
    ),

    // syrupUSDC - Chainlink - transporter.io
    allowErc20Approve([syrupUSDC], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "4949039107694359620", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-arbitrum-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: syrupUSDC,
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

    // USDC - Stargate
    allowErc20Approve([USDC], [contracts.mainnet.stargate.poolUsdc]),
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30110", // Arbitrum chain ID
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

    // USDC - Chainlink - transporter.io
    allowErc20Approve([USDC], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "4949039107694359620", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-arbitrum-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: USDC,
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

    // USDT - Arbitrum Bridge
    allowErc20Approve(
      [USDT],
      [contracts.mainnet.arbitrumBridge.usdtOftAdapter]
    ),
    // https://docs.layerzero.network/v2/developers/evm/oft/oft-patterns-extensions#sending-token
    allow.mainnet.arbitrumBridge.usdtOftAdapter.send(
      {
        dstEid: "30110", // Arbitrum
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
  ] satisfies PermissionList
