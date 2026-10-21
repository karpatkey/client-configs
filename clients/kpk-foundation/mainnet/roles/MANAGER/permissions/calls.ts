import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import {
  DAI,
  frxUSD,
  GHO,
  USDC,
  USDG,
  USDT,
  XAUt,
  euler,
  fluid,
  gearbox,
  kpk,
  symbiotic,
} from "@/addresses/eth"
import { USDG as USDG_RH } from "@/addresses/robinhood"
import { contracts } from "@/contracts"
import {
  kpkFoundationGc,
  kpkFoundationRh,
  fundReapGeneralEth,
  kfPaymentsEth,
  kpkEth,
  meowBankEth,
} from "../../../../addresses"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave v3 - sGHO
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.sGho]),
    allow.mainnet.aaveV3.sGho.deposit(undefined, c.avatar),
    allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.aaveV3.sGho.redeem(undefined, c.avatar, c.avatar),

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

    // Fluid - Claim rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
    },

    // Gearbox - frxUSD RWA Vault - Curator: kpk (not supported by DeFi Kit)
    allowErc20Approve([frxUSD], [gearbox.kpkFrxUsd]),
    {
      ...allow.mainnet.gearbox.vault.deposit(undefined, c.avatar),
      targetAddress: gearbox.kpkFrxUsd,
    },
    {
      ...allow.mainnet.gearbox.vault.depositWithReferral(undefined, c.avatar),
      targetAddress: gearbox.kpkFrxUsd,
    },
    {
      ...allow.mainnet.gearbox.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkFrxUsd,
    },
    {
      ...allow.mainnet.gearbox.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkFrxUsd,
    },

    // KPK - USD Alpha Fund
    allowErc20Approve([USDC, USDT], [kpk.usdAlphaFundShares]),
    {
      ...allow.mainnet.oiv.shares.requestSubscription(
        undefined,
        undefined,
        c.or(USDC, USDT),
        c.avatar
      ),
      targetAddress: kpk.usdAlphaFundShares,
    },
    {
      ...allow.mainnet.oiv.shares.requestRedemption(
        undefined,
        undefined,
        c.or(USDC, USDT),
        c.avatar
      ),
      targetAddress: kpk.usdAlphaFundShares,
    },
    // KPK - XAUt Carry Fund
    allowErc20Approve([XAUt], [kpk.xautCarryFundShares]),
    {
      ...allow.mainnet.oiv.shares.requestSubscription(
        undefined,
        undefined,
        XAUt,
        c.avatar
      ),
      targetAddress: kpk.xautCarryFundShares,
    },
    {
      ...allow.mainnet.oiv.shares.requestRedemption(
        undefined,
        undefined,
        XAUt,
        c.avatar
      ),
      targetAddress: kpk.xautCarryFundShares,
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

    // Symbiotic - KPK USDC LiquidLane (RWA Liquidity) - ERC-4626 vault, scoped via the generic
    // Morpho vault ABI + a targetAddress override (same deposit / withdraw / redeem selectors)
    allowErc20Approve([USDC], [symbiotic.kpkUsdcLiquidLane]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },

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
    // USDC -> USDC.e - Gnosis Bridge
    allowErc20Approve([USDC], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.gnosisBridge.usdcTransmuter,
      undefined,
      "0x" + kpkFoundationGc.slice(2).padStart(64, "0")
    ),
    // Claim bridged USDC from Gnosis
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.safeExecuteSignaturesWithAutoGasLimit(
      c.and(
        // messageId: 32 bytes
        // First 4 bytes
        c.bitmask({
          shift: 0,
          mask: "0xffffffff",
          value: "0x00050000",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4,
          mask: "0xffffffffffffffffffff",
          value: "0xa7823d6f1e31569f5186",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x1e345b30c6bebf70ebe7",
        }),
        // skip last 8 bytes (nonce)
        // sender: 20 bytes
        c.bitmask({
          shift: 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
        }),
        // gasLimit: 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20,
          mask: "0xffffffff",
          value: "0x000927c0",
        }),
        // dataType + chainIds: 5 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4,
          mask: "0xffffffffff",
          value: "0x0101806401",
        }),
        // selector (handleNativeTokens): 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5,
          mask: "0xffffffff",
          value: "0x272255bb",
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Token address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC.slice(22, 42), // Last 10 bytes of the token address
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // Mainnet -> Robinhood
    // USDG - LiFi (Glacis -> Paxos USDG OFT), native USDG minted to the Foundation Safe on Robinhood
    allowErc20Approve([USDG], [contracts.mainnet.lifi.diamond]),
    allow.mainnet.lifi.diamond.startBridgeTokensViaGlacis(
      {
        sendingAssetId: USDG,
        receiver: kpkFoundationRh,
        destinationChainId: 4663,
        hasSourceSwaps: false,
        hasDestinationCall: false,
      },
      {
        receiverAddress: "0x" + kpkFoundationRh.slice(2).padStart(64, "0"),
        refundAddress: c.avatar,
        outputToken: "0x" + USDG_RH.slice(2).padStart(64, "0"),
      },
      { send: true }
    ),

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer up to 500K USDC per month to kpkEth
    allowErc20Transfer([USDC], [kpkEth], "USDC_KPK-ETH"),

    // Transfer up to 100K USDC per month to kfPaymentsEth
    allowErc20Transfer([USDC], [kfPaymentsEth], "USDC_KF-PAYMENTS-ETH"),

    // Transfer up to 100K USDC per month to fundReapGeneralEth (Reap Bank)
    allowErc20Transfer(
      [USDC],
      [fundReapGeneralEth],
      "USDC_FUND-REAP-GENERAL-ETH"
    ),

    // Transfer up to 50K USDC per month to meowBankEth (Meow Bank)
    allowErc20Transfer([USDC], [meowBankEth], "USDC_MEOW-BANK-ETH"),
  ] satisfies PermissionList
