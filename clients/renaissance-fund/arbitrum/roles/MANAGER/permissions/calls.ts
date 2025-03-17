import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, WETH, gmx } from "@/addresses/arb1"
import { zeroAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // GMX
  // Create Long/Short Market/Limit Orders
  // Increase/Decrease Collateral on an open position
  // Settle Funding Fees
  ...allowErc20Approve([USDC], [gmx.router]),
  // This is the only function within multicall that receives ETH
  // It's called in all cases
  allow.arbitrumOne.gmx.exchangeRouter.sendWnt(gmx.orderVault, undefined, {
    send: true,
  }),
  // It's only called when an order is created
  allow.arbitrumOne.gmx.exchangeRouter.sendTokens(USDC, gmx.orderVault),
  allow.arbitrumOne.gmx.exchangeRouter.createOrder({
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
  // Claim Funding Fees
  allow.arbitrumOne.gmx.exchangeRouter.claimFundingFees(
    c.every(c.eq(gmx.marketToken)),
    [WETH, USDC],
    c.avatar
  ),

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.arbitrumOne.navCalculator.bridgeStart(),

  // Arbitrum -> Mainnet
  // USDC (Arbitrum) -> USDC (Mainnet) - HOP
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.l2HopCctp]),
  allow.arbitrumOne.l2HopCctp.send(
    1, // Mainnet
    c.avatar
  ),
] satisfies PermissionList
