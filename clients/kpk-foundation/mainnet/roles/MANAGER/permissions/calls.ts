import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { DAI, EURC, USDC, kpk, morpho } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { kfPaymentsEth } from "../../../../../kpk-dao/mainnet/addresses"
import { kpkFoundationGc, fundReapGeneralEth } from "../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

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

    // Morpho - kpk EURC v1 Vault
    allowErc20Approve([EURC], [morpho.kpkEurcV1]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkEurcV1,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurcV1,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurcV1,
    },
    // Morpho - kpk EURC v2 Vault
    allowErc20Approve([EURC], [morpho.kpkEurcV2]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkEurcV2,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurcV2,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurcV2,
    },
    // Morpho - kpk USDC Prime v1 Vault
    allowErc20Approve([USDC], [morpho.kpkUsdcV1]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkUsdcV1,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcV1,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcV1,
    },
    // Morpho - kpk USDC Prime v2 Vault
    allowErc20Approve([USDC], [morpho.kpkUsdcV2]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkUsdcV2,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcV2,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcV2,
    },
    // Morpho - Claim Rewards
    allow.mainnet.morpho.universalRewardsDistributor.claim(c.avatar),

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
    // Transfer 100K USDC per month to kfPaymentsEth
    allowErc20Transfer([USDC], [kfPaymentsEth], "USDC_KF-PAYMENTS-ETH"),

    // Transfer 100K USDC per month to fundReapGeneralEth
    allowErc20Transfer(
      [USDC],
      [fundReapGeneralEth],
      "USDC_FUND-REAP-GENERAL-ETH"
    ),
  ] satisfies PermissionList
