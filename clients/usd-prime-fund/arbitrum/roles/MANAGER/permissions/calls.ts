import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { GHO, USDC, USDT, aura, balancerV3 } from "@/addresses/arb1"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aura - Aave Boosted USDT/GHO/USDC
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.arbitrumOne.aura.booster]
    ),
    allow.arbitrumOne.aura.booster.deposit("99"),
    {
      ...allow.arbitrumOne.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.arbitrumOne.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },
    {
      ...allow.arbitrumOne.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveGhoUsdtUsdcRewarder,
    },

    // Balancer v3 - Aave Boosted USDT/GHO/USDC
    // permit2 is the same contract address across chains, so using contracts.mainnet.uniswap.permit2 is valid
    allowErc20Approve([GHO, USDC, USDT], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC, USDT),
      contracts.arbitrumOne.balancerV3.compositeLiquidityRouter
    ),
    allow.arbitrumOne.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allow.arbitrumOne.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.arbitrumOne.balancerV3.compositeLiquidityRouter]
    ),
    allow.arbitrumOne.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [balancerV3.aaveGhoUsdtUsdcGauge]
    ),
    {
      ...allow.arbitrumOne.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.arbitrumOne.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.arbitrumOne.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },

    /*********************************************
     * Bridges
     *********************************************/
    // USDC - Stargate to Mainnet
    allowErc20Approve([USDC], [contracts.arbitrumOne.stargate.poolUsdc]),
    allow.arbitrumOne.stargate.poolUsdc.send(
      {
        dstEid: "30101", // Mainnet ID
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

    // USDT - Stargate to Mainnet
    allowErc20Approve([USDT], [contracts.arbitrumOne.stargate.poolUsdt]),
    allow.arbitrumOne.stargate.poolUsdt.send(
      {
        dstEid: "30101", // Mainnet chain ID
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
  ] satisfies PermissionList
