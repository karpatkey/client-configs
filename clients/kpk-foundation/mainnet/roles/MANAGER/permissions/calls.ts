import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { DAI, USDC, WETH, euler, kpk } from "@/addresses/eth"
import { contracts } from "@/contracts"
import {
  kpkFoundationGc,
  fundReapGeneralEth,
  kfPaymentsEth,
  kpkEth
} from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Euler - KPK RWA USDC
    allowErc20Approve([USDC], [euler.kpkRwaUsdc]),
    {
      ...allow.mainnet.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },
    {
      ...allow.mainnet.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },
    {
      ...allow.mainnet.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },
    
    // kpk - USD Prime Fund
    allowErc20Approve([USDC], [kpk.usdPrimeFundShares]),
    {
      ...allow.mainnet.kpk.shares.requestDeposit(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.usdPrimeFundShares,
    },
    {
      ...allow.mainnet.kpk.shares.requestRedeem(undefined, undefined, c.avatar),
      targetAddress: kpk.usdPrimeFundShares,
    },
    // kpk - Renaissance Fund
    allowErc20Approve([USDC], [kpk.renaissanceFundShares]),
    {
      ...allow.mainnet.kpk.shares.requestDeposit(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.renaissanceFundShares,
    },
    {
      ...allow.mainnet.kpk.shares.requestRedeem(undefined, undefined, c.avatar),
      targetAddress: kpk.renaissanceFundShares,
    },
    // KPK - ETH Alpha Fund
    allowErc20Approve([WETH], [kpk.ethAlphaFundShares]),
    {
      ...allow.mainnet.oiv.shares.requestSubscription(
        undefined,
        undefined,
        WETH,
        c.avatar
      ),
      targetAddress: kpk.ethAlphaFundShares,
    },
    {
      ...allow.mainnet.oiv.shares.requestRedemption(
        undefined,
        undefined,
        WETH,
        c.avatar
      ),
      targetAddress: kpk.ethAlphaFundShares,
    },

    // Merkl - Rewards
    allow.mainnet.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
    ),

    /*********************************************
     * Swaps
     *********************************************/
    // Spark - Swap USDC <-> DAI
    allowErc20Approve([DAI, USDC], [contracts.mainnet.spark.litePsmUsdcA]),
    allow.mainnet.spark.litePsmUsdcA.sellGem(c.avatar),
    allow.mainnet.spark.litePsmUsdcA.buyGem(c.avatar),

    /*********************************************
     * Bridging
     *********************************************/
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, kpkFoundationGc),
    // Claim bridged XDAI from Gnosis
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.executeSignatures(
      c.and(
        // Avatar address
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes corresponding to the amount
        // skip 32 bytes corresponding to the nonce
        // Recipient address: xDai Bridge
        c.bitmask({
          shift: 20 + 32 + 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the xDai Bridge
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the xDai Bridge
        })
      )
    ),

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer up to 100K USDC per month to kfPaymentsEth
    allowErc20Transfer([USDC], [kfPaymentsEth], "USDC_KF-PAYMENTS-ETH"),

    // Transfer up tp 100K USDC per month to fundReapGeneralEth
    allowErc20Transfer(
      [USDC],
      [fundReapGeneralEth],
      "USDC_FUND-REAP-GENERAL-ETH"
    ),

    // Transfer up to 500K USDC per month to kpkEth
    allowErc20Transfer([USDC], [kpkEth], "USDC_KPK-ETH"),
  ] satisfies PermissionList
