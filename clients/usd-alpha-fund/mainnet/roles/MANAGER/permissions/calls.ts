import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  crvUSD,
  GHO,
  RLUSD,
  sUSDe,
  syrupUSDC,
  USDC,
  USDe,
  USDT,
  balancerV3,
  morpho,
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

    // Aave v3 - sGHO (Savings GHO)
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.sGho]),
    allow.mainnet.aaveV3.sGho.deposit(undefined, c.avatar),
    allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.aaveV3.sGho.redeem(undefined, c.avatar, c.avatar),

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

    // Curve - crvUSD/USDC
    allowErc20Approve([crvUSD, USDC], [contracts.mainnet.curve.crvUsdUsdcPool]),
    allow.mainnet.curve.crvUsdUsdcPool["add_liquidity(uint256[2],uint256)"](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Curve - crvUSD/USDT
    allowErc20Approve([crvUSD, USDT], [contracts.mainnet.curve.crvUsdUsdtPool]),
    allow.mainnet.curve.crvUsdUsdtPool["add_liquidity(uint256[2],uint256)"](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Curve - RLUSD/USDC
    allowErc20Approve([RLUSD, USDC], [contracts.mainnet.curve.rlUsdUsdcPool]),
    allow.mainnet.curve.rlUsdUsdcPool["add_liquidity(uint256[],uint256)"](),
    allow.mainnet.curve.rlUsdUsdcPool["remove_liquidity(uint256,uint256[])"](),
    allow.mainnet.curve.rlUsdUsdcPool[
      "remove_liquidity_imbalance(uint256[],uint256)"
    ](),
    allow.mainnet.curve.rlUsdUsdcPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

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

    /*********************************************
     * Bridges
     *********************************************/
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
  ] satisfies PermissionList
