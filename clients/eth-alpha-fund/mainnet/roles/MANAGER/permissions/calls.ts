import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "@/contracts"
import {
  eETH,
  rETH,
  WETH,
  wstETH,
  aura,
  balancerV3,
} from "@/addresses/eth"
import {
  WETH as WETH_arb1,
} from "@/addresses/arb1"
import {
  WETH as WETH_base,
} from "@/addresses/base"
import {
  WETH as WETH_oeth,
} from "@/addresses/oeth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave Core v3 - Enable/Disable E-Mode
    allow.mainnet.aaveV3.poolCoreV3.setUserEMode(),

    // Aave Prime v3 - Enable/Disable E-Mode
    allow.mainnet.aaveV3.poolPrimeV3.setUserEMode(),

    // Aura - Aave Boosted WETH/rETH
    allowErc20Approve(
      [balancerV3.rEthWaEthWeth],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("271"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.aurarEthWaEthWethRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.aurarEthWaEthWethRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.aurarEthWaEthWethRewarder,
    },

    // Balancer v3 - Aave Boosted WETH/rETH
    allowErc20Approve([WETH, rETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, rETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.rEthWaEthWeth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.rEthWaEthWeth
    ),
    allowErc20Approve(
      [balancerV3.rEthWaEthWeth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.rEthWaEthWeth
    ),
    allowErc20Approve(
      [balancerV3.rEthWaEthWeth],
      [balancerV3.rEthWaEthWethGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.rEthWaEthWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.rEthWaEthWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.rEthWaEthWethGauge,
    },
    allow.mainnet.balancerV2.minter.mint(balancerV3.rEthWaEthWethGauge),

    // ether.fi - EigenLayer Restaking
    // Stake ETH for eETH
    allow.mainnet.etherfi.liquidityPool["deposit()"]({ send: true }),
    // Request Withdrawal - A Withdraw Request NFT is issued
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
    allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
    // Funds can be claimed once the request is finalized
    allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
    // Stake ETH for weETH
    allow.mainnet.etherfi.depositAdapter.depositETHForWeETH(undefined, {
      send: true,
    }),
    // ether.fi - Wrap/Unwrap
    // Wrap eETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.weEth]),
    allow.mainnet.etherfi.weEth.wrap(),
    // Unwrap weETH
    allow.mainnet.etherfi.weEth.unwrap(),
    // ether.fi - Claim rewards
    allow.mainnet.etherfi.kingDistributor.claim(c.avatar),

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
     * Bridge
     *********************************************/
    // Mainnet -> Arbitrum
    // ETH - Arbitrum Bridge
    allow.mainnet.arbitrumBridge.delayedInbox.createRetryableTicket(
      c.avatar, // Destination address
      undefined,
      undefined,
      c.avatar, // Origin address
      c.avatar, // Destination address
      undefined,
      undefined,
      "0x",
      {
        send: true,
      }
    ),
    // Claim bridged ETH from Arbitrum
    allow.mainnet.arbitrumBridge.outbox4.executeTransaction(
      undefined,
      undefined,
      c.avatar, // Origin address
      c.avatar, // Destination address
      undefined,
      undefined,
      undefined,
      undefined,
      "0x"
    ),

    // WETH - Arbitrum Bridge
    allowErc20Approve([WETH], [contracts.mainnet.arbitrumBridge.wethGateway]),
    allow.mainnet.arbitrumBridge.arbL1GatewayRouter.outboundTransfer(
      WETH,
      c.avatar,
      undefined,
      undefined,
      undefined,
      c.or("0x", c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"])),
      {
        send: true,
      }
    ),
    // Claim bridged WETH from Arbitrum
    allow.mainnet.arbitrumBridge.outbox4.executeTransaction(
      undefined,
      undefined,
      contracts.arbitrumOne.arbitrumBridge.l2WethGateway, // Origin address
      contracts.mainnet.arbitrumBridge.wethGateway, // Destination address
      undefined,
      undefined,
      undefined,
      undefined,
      c.calldataMatches(
        allow.mainnet.arbitrumBridge.wethGateway.finalizeInboundTransfer(
          WETH,
          c.avatar,
          c.avatar,
          undefined,
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F6#L116
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F15#L58
          // The callHookData should be scoped to 0x to prevent any unwanted data from being included
          c.or("0x", c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"])),
        )
      )
    ),

    // WETH - Across
    allowErc20Approve([WETH], [contracts.mainnet.across.ethereumSpokePoolV2]),
    allow.mainnet.across.ethereumSpokePoolV2.deposit(
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + WETH.slice(2).padStart(64, "0"),
      "0x" + WETH_arb1.slice(2).padStart(64, "0"),
      undefined,
      undefined,
      42161,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      undefined,
      undefined,
      undefined,
      "0x",
    ),

    // wstETH - Arbitrum Bridge
    allowErc20Approve([wstETH], [contracts.mainnet.arbitrumBridge.lidoArbL1Erc20TokenGateway]),
    allow.mainnet.arbitrumBridge.arbL1GatewayRouter.outboundTransfer(
      wstETH,
      c.avatar,
      undefined,
      undefined,
      undefined,
      c.or("0x", c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"])),
      {
        send: true,
      }
    ),
    // Claim bridged wstETH from Arbitrum
    allow.mainnet.arbitrumBridge.outbox4.executeTransaction(
      undefined,
      undefined,
      contracts.arbitrumOne.arbitrumBridge.lidoL2Erc20TokenGateway, // Origin address
      contracts.mainnet.arbitrumBridge.lidoArbL1Erc20TokenGateway, // Destination address
      undefined,
      undefined,
      undefined,
      undefined,
      c.calldataMatches(
        allow.mainnet.arbitrumBridge.lidoArbL1Erc20TokenGateway.finalizeInboundTransfer(
          wstETH,
          c.avatar,
          c.avatar,
          undefined,
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F6#L116
          // https://etherscan.io/address/0xb4299a1f5f26ff6a98b7ba35572290c359fde900#code#F15#L58
          // The callHookData should be scoped to 0x to prevent any unwanted data from being included
          c.or("0x", c.abiEncodedMatches([undefined, "0x"], ["uint256", "bytes"])),
        )
      )
    ),

    // Mainnet -> Base
    // ETH - brid.gg or superbridge
    allow.mainnet.baseBridge.baseBridge.bridgeETHTo(
      c.avatar,
      undefined,
      // 0x6272696467670a equals bridgg in hex and 0x73757065726272696467650a equals superbridge in hex
      c.or("0x", "0x6272696467670a", "0x73757065726272696467650a"), 
      {
        send: true,
      }
    ),

    // WETH - Across
    allowErc20Approve([WETH], [contracts.mainnet.across.ethereumSpokePoolV2]),
    allow.mainnet.across.ethereumSpokePoolV2.deposit(
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + WETH.slice(2).padStart(64, "0"),
      "0x" + WETH_base.slice(2).padStart(64, "0"),
      undefined,
      undefined,
      8453,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      undefined,
      undefined,
      undefined,
      "0x",
    ),

    // Mainnet -> Gnosis
    // ETH -> WETH - Gnosis Bridge
    allow.mainnet.gnosisBridge.wethOmnibridgeRouter[
      "wrapAndRelayTokens(address)"
    ](c.avatar, { send: true }),

    // WETH - Gnosis Bridge
    allowErc20Approve([WETH], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](WETH, c.avatar),
    // Claim bridged WETH from Gnosis - Gnosis Bridge
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
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
    
    // wstETH - Gnosis Bridge
    allowErc20Approve([wstETH], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](wstETH, c.avatar),
    // Claim bridged wstETH from Gnosis - Gnosis Bridge
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
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

    // Mainnet -> Optimism
    // ETH - brid.gg or superbridge
    allow.mainnet.optimismBridge.optGateway.bridgeETHTo(
      c.avatar,
      undefined,
      // 0x6272696467670a equals bridgg in hex and 0x73757065726272696467650a equals superbridge in hex
      c.or("0x", "0x6272696467670a", "0x73757065726272696467650a"),
      {
        send: true,
      }
    ),

    // WETH - Across
    allowErc20Approve([WETH], [contracts.mainnet.across.ethereumSpokePoolV2]),
    allow.mainnet.across.ethereumSpokePoolV2.deposit(
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      "0x" + WETH.slice(2).padStart(64, "0"),
      "0x" + WETH_oeth.slice(2).padStart(64, "0"),
      undefined,
      undefined,
      10,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      undefined,
      undefined,
      undefined,
      "0x",
    ),
  ] satisfies PermissionList
