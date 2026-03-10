import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, WETH, gmx } from "@/addresses/arb1"
import { zeroAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.arbitrumOne.weth.withdraw(),
    allow.arbitrumOne.weth.deposit({
      send: true,
    }),

    // GMX
    // Create Long/Short Market/Limit Orders
    // Increase/Decrease Collateral on an open position
    // Settle Funding Fees
    allowErc20Approve([USDC], [...gmx.exchangeRouters]),
    // This is the only function within multicall that receives ETH
    // It's called in all cases
    ...gmx.exchangeRouters.map((exchangeRouter) => ({
      ...allow.arbitrumOne.gmx.exchangeRouter.sendWnt(
        gmx.orderVault,
        undefined,
        {
          send: true,
        }
      ),
      targetAddress: exchangeRouter,
    })),
    // It's only called when an order is created
    ...gmx.exchangeRouters.map((exchangeRouter) => ({
      ...allow.arbitrumOne.gmx.exchangeRouter.sendTokens(USDC, gmx.orderVault),
      targetAddress: exchangeRouter,
    })),
    ...gmx.exchangeRouters.map((exchangeRouter) => ({
      ...allow.arbitrumOne.gmx.exchangeRouter.createOrder({
        addresses: {
          receiver: c.avatar,
          cancellationReceiver: zeroAddress,
          callbackContract: zeroAddress,
          uiFeeReceiver: gmx.uiFeeReceiver,
          market: gmx.marketToken,
          initialCollateralToken: USDC,
          swapPath: [],
        },
        orderType: c.or(
          2, // MarketIncrease
          3, // LimitIncrease
          4, // MarketDecrease
          5 // LimitDecrease
        ),
      }),
      targetAddress: exchangeRouter,
    })),
    // Claim Funding Fees
    ...gmx.exchangeRouters.map((exchangeRouter) => ({
      ...allow.arbitrumOne.gmx.exchangeRouter.claimFundingFees(
        c.every(c.eq(gmx.marketToken)),
        [WETH, USDC],
        c.avatar
      ),
      targetAddress: exchangeRouter,
    })),

    /*********************************************
     * Bridge
     *********************************************/
    // Arbitrum -> Mainnet
    // ETH - Arbitrum Bridge
    allow.arbitrumOne.arbitrumBridge.arbSys.withdrawEth(
      c.avatar, // Destination address
      {
        send: true,
      }
    ),

    // ETH - Stargate
    allow.arbitrumOne.stargate.poolNative.send(
      {
        dstEid: "30101", // Ethereum
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

    // USDC - HOP
    allowErc20Approve([USDC], [contracts.arbitrumOne.hop.l2HopCctp]),
    allow.arbitrumOne.hop.l2HopCctp.send(
      1, // Mainnet
      c.avatar
    ),
  ] satisfies PermissionList
