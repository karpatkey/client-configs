import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Approve } from "@/helpers"
import { USDG as USDG_ETH } from "@/addresses/eth"
import { USDG, lifi } from "@/addresses/robinhood"
import { kpkFoundationEth } from "../../../../addresses"

export default [
  /*********************************************
   * Bridge
   *********************************************/
  // Robinhood -> Mainnet
  // USDG - LiFi (Glacis -> Paxos USDG OFT), USDG to the Foundation Safe on Ethereum.
  // Same Diamond ABI as mainnet with the Robinhood Diamond as target.
  allowErc20Approve([USDG], [lifi.diamond]),
  {
    ...allow.mainnet.lifi.diamond.startBridgeTokensViaGlacis(
      {
        sendingAssetId: USDG,
        receiver: kpkFoundationEth,
        destinationChainId: 1,
        hasSourceSwaps: false,
        hasDestinationCall: false,
      },
      {
        receiverAddress: "0x" + kpkFoundationEth.slice(2).padStart(64, "0"),
        refundAddress: c.avatar,
        outputToken: "0x" + USDG_ETH.slice(2).padStart(64, "0"),
      },
      { send: true }
    ),
    targetAddress: lifi.diamond,
  },
] satisfies PermissionList
