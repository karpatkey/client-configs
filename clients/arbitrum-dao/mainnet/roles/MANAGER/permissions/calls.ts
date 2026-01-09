import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { COMP, USDT } from "@/addresses/eth"
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
    // Claim bridged COMP from Arbitrum
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
            "0x",
            c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"])
          )
        )
      )
    ),
  ] satisfies PermissionList
