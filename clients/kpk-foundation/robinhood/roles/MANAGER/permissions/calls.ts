import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { allowErc20Approve } from "@/helpers"
import { USDG as USDG_ETH } from "@/addresses/eth"
import { SPY, USDG, WETH, kpk, kyberswap, lifi } from "@/addresses/robinhood"
import { eAddress } from "@/addresses"
import { kpkFoundationEth } from "../../../../addresses"

export default [
  // KPK OIVs on Robinhood - kRHUSD and kRHETH (USDG), kRHSPY (SPY)
  allowErc20Approve([USDG], [kpk.kRhUsdShares, kpk.kRhEthShares]),
  allowErc20Approve([SPY], [kpk.kRhSpyShares]),
  {
    ...allow.mainnet.oiv.shares.requestSubscription(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhUsdShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhUsdShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestSubscription(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhEthShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      USDG,
      c.avatar
    ),
    targetAddress: kpk.kRhEthShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestSubscription(
      undefined,
      undefined,
      SPY,
      c.avatar
    ),
    targetAddress: kpk.kRhSpyShares,
  },
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      SPY,
      c.avatar
    ),
    targetAddress: kpk.kRhSpyShares,
  },

  /*********************************************
   * Swaps
   *********************************************/
  // KyberSwap - [ETH, WETH, USDG, SPY] <-> [ETH, WETH, USDG, SPY]
  // Same scoping as the repo precedent (tokens, receiver = avatar, no permit), tightened: the input
  // tokens can only go to Kyber's executor and no fee receivers are allowed.
  allowErc20Approve([USDG, SPY, WETH], [kyberswap.metaAggregationRouterV2]),
  {
    ...allow.mainnet.kyberswap.metaAggregationRouterV2.swap(
      {
        callTarget: kyberswap.aggregatorExecutor,
        desc: {
          srcToken: c.or(eAddress, WETH, USDG, SPY),
          dstToken: c.or(eAddress, WETH, USDG, SPY),
          srcReceivers: [kyberswap.aggregatorExecutor],
          feeReceivers: [],
          dstReceiver: c.avatar,
          permit: "0x",
        },
      },
      { send: true }
    ),
    targetAddress: kyberswap.metaAggregationRouterV2,
  },

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
