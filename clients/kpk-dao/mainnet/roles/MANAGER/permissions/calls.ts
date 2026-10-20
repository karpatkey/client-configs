import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  eETH,
  GNO,
  SPK,
  USDC,
  USDT,
  WBTC,
  weETH,
  WETH,
  wstETH,
  XAUt,
  fluid,
  kpk,
} from "@/addresses/eth"
import { eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowEthTransfer,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"
import {
  kpkDaoPaymentsEth,
  vacarabiaEth,
  kpkFoundationEth,
} from "../../../../addresses"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // ether.fi - Stake
    // Stake ETH for eETH
    allow.mainnet.etherfi.liquidityPool["deposit()"]({ send: true }),
    // Stake ETH for weETH
    allow.mainnet.etherfi.depositAdapter.depositETHForWeETH(undefined, {
      send: true,
    }),
    // ether.fi - Unstake
    // Standard unstaking eETH -> ETH - A Withdraw Request NFT is issued
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
    allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
    // Standard unstaking weETH -> ETH - A Withdraw Request NFT is issued
    allowErc20Approve([weETH], [contracts.mainnet.etherfi.withdrawalAdapter]),
    allow.mainnet.etherfi.withdrawalAdapter.requestWithdraw(
      undefined,
      c.avatar
    ),
    // Funds can be claimed once the request is finalized
    // The same function is called for both paths (eETH/weETH -> ETH)
    allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
    // Express (instant) unstaking eETH -> ETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.redemptionManager]),
    allow.mainnet.etherfi.redemptionManager.redeemEEth(
      undefined,
      c.avatar,
      eAddress
    ),
    // Express (instant) unstaking weETH -> ETH
    allowErc20Approve([weETH], [contracts.mainnet.etherfi.redemptionManager]),
    allow.mainnet.etherfi.redemptionManager.redeemWeEth(
      undefined,
      c.avatar,
      eAddress
    ),
    // ether.fi - Wrap/Unwrap
    // Wrap eETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.weEth]),
    allow.mainnet.etherfi.weEth.wrap(),
    // Unwrap weETH
    allow.mainnet.etherfi.weEth.unwrap(),

    // Fluid - FLUID Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
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
    // KPK - WBTC Carry Fund
    allowErc20Approve([WBTC], [kpk.wbtcCarryFundShares]),
    {
      ...allow.mainnet.oiv.shares.requestSubscription(
        undefined,
        undefined,
        WBTC,
        c.avatar
      ),
      targetAddress: kpk.wbtcCarryFundShares,
    },
    {
      ...allow.mainnet.oiv.shares.requestRedemption(
        undefined,
        undefined,
        WBTC,
        c.avatar
      ),
      targetAddress: kpk.wbtcCarryFundShares,
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

    // Spark - Stake/Unstake SPK
    allowErc20Approve([SPK], [contracts.mainnet.spark.stSpk]),
    allow.mainnet.spark.stSpk.deposit(c.avatar),
    allow.mainnet.spark.stSpk.withdraw(c.avatar),
    allow.mainnet.spark.stSpk.redeem(c.avatar),
    allow.mainnet.spark.stSpk.claim(c.avatar),
    allow.mainnet.spark.stSpk.claimBatch(c.avatar),

    /*********************************************
     * Bridge
     *********************************************/
    // Gnosis -> Mainnet - claims of the GNO, WETH and wstETH bridged from the KPK DAO Gnosis Safe
    // Claim bridged GNO from Gnosis
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
          value: GNO.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + GNO.slice(22, 42), // Last 10 bytes of the token address
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
    // Claim bridged WETH from Gnosis - Gnosis Bridge
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
          value: WETH.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + WETH.slice(22, 42), // Last 10 bytes of the token address
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
    // Claim bridged wstETH from Gnosis - Gnosis Bridge
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
          value: wstETH.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + wstETH.slice(22, 42), // Last 10 bytes of the token address
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

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer up to 10 ETH per month to kpkDaoPaymentsEth
    allowEthTransfer(kpkDaoPaymentsEth, "ETH_KPK-PAYMENTS-ETH"),

    // Transfer up to 100K USDC per month to kpkDaoPaymentsEth
    allowErc20Transfer(
      [USDC],
      [kpkDaoPaymentsEth],
      "USDC_KPK_DAO-PAYMENTS-ETH"
    ),

    // Transfer up to 500K USDC per month to vacarabiaEth
    allowErc20Transfer([USDC], [vacarabiaEth], "USDC_VACARABIA-ETH"),

    // Transfer up to 500K USDC per month to kpkFoundationEth
    allowErc20Transfer([USDC], [kpkFoundationEth], "USDC_KPK_FOUNDATION-ETH"),
  ] satisfies PermissionList
