import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
import {
  GHO,
  sUSDe,
  USDC,
  USDe,
  USDS,
  USDT,
  aura,
  balancerV3,
  pendle,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Protocols
     *********************************************/

    // Aura - Aave Boosted USDT/GHO/USDC
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("246"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },

    // Balancer v3 - Aave Boosted USDT/GHO/USDC
    allowErc20Approve([GHO, USDC, USDT], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC, USDT),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [balancerV3.aaveGhoUsdtUsdcGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },

    // cap - USDC/cUSD
    allowErc20Approve([USDC], [contracts.mainnet.cap.cUsd]),
    allow.mainnet.cap.cUsd.mint(USDC, undefined, undefined, c.avatar),
    allow.mainnet.cap.cUsd.burn(USDC, undefined, undefined, c.avatar),
    // cap - cUSD Stake and Unstake
    allowErc20Approve(
      [contracts.mainnet.cap.cUsd],
      [contracts.mainnet.cap.stcUsd]
    ),
    allow.mainnet.cap.stcUsd.deposit(undefined, c.avatar),
    allow.mainnet.cap.stcUsd.redeem(undefined, c.avatar, c.avatar),

    // Ethena - Stake USDe
    allowErc20Approve([USDe], [sUSDe]),
    allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
    // Ethena - Unstake USDe
    allow.mainnet.ethena.sUsde.cooldownShares(),
    allow.mainnet.ethena.sUsde.unstake(c.avatar),

    // Merkl - Rewards (max 4 tokens: aEthRLUSD, MORPHO, stkGHO and USDS)
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
        ]
      )
    ),

    // Pendle - USDe <-> PT-USDE-DDMMMYYYY / sUSDe <-> PT-sUSDE-DDMMMYYYY
    allowErc20Approve([USDe, sUSDe], [contracts.mainnet.pendle.routerV4]),
    allow.mainnet.pendle.routerV4.swapExactTokenForPt(
      c.avatar,
      c.or(
        pendle.marketUsde25Sep2025,
        pendle.marketUsde27Nov2025,
        pendle.marketSusde25Sep2025,
        pendle.marketSusde27Nov2025
      ),
      undefined,
      undefined,
      {
        tokenIn: c.or(USDe, sUSDe),
        tokenMintSy: c.or(USDe, sUSDe),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),
    allowErc20Approve(
      [
        pendle.ptUsde25Sep2025,
        pendle.ptUsde27Nov2025,
        pendle.ptSusde25Sep2025,
        pendle.ptSusde27Nov2025,
      ],
      [contracts.mainnet.pendle.routerV4]
    ),
    allow.mainnet.pendle.routerV4.swapExactPtForToken(
      c.avatar,
      c.or(
        pendle.marketUsde25Sep2025,
        pendle.marketUsde27Nov2025,
        pendle.marketSusde25Sep2025,
        pendle.marketSusde27Nov2025
      ),
      undefined,
      {
        tokenOut: c.or(USDe, sUSDe),
        tokenRedeemSy: c.or(USDe, sUSDe),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),

    /*********************************************
     * Bridges
     *********************************************/
    // Mainnet -> Gnosis
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "465200170687744372", // https://docs.chain.link/ccip/directory/mainnet/chain/xdai-mainnet
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: GHO,
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

    // USDS -> XDAI - Gnosis Bridge
    allowErc20Approve([USDS], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(USDS, c.avatar),
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
      "0x" + parameters.avatar.slice(2).padStart(64, "0")
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

    // USDC - Stargate
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30145", // Gnosis Chain ID
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

    // Mainnet -> Arbitrum
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "4949039107694359620", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-arbitrum-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: GHO,
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

    // USDT - Stargate
    {
      ...allow.mainnet.stargate.poolUsdc.send(
        {
          dstEid: "30110", // Arbitrum chain ID
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
      targetAddress: contracts.mainnet.stargate.poolUsdt,
    },

    // Mainnet -> Base
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "15971525489660198786", // https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-base-1
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: GHO,
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
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30184", // Base chain ID
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

    // Mainnet -> Optimism
    // USDC - Stargate
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30184", // Base chain ID
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

    // USDC - Stargate
    allow.mainnet.stargate.poolUsdc.send(
      {
        dstEid: "30111", // Optimism chain ID
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

    // USDT - Stargate
    allowErc20Approve([USDT], [contracts.mainnet.stargate.poolUsdt]),
    {
      ...allow.mainnet.stargate.poolUsdc.send(
        {
          dstEid: "30111", // Optimism chain ID
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
      targetAddress: contracts.mainnet.stargate.poolUsdt,
    },
  ] satisfies PermissionList
