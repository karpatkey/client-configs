import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  cbBTC,
  cbETH,
  GHO,
  USDC,
  aura,
  balancerV3,
  morpho,
} from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Protocols
     *********************************************/

    // Aura - Aave Boosted GHO/USDC
    allowErc20Approve([balancerV3.aaveUsdcGho], [contracts.base.aura.booster]),
    allow.base.aura.booster.deposit("19"),
    {
      ...allow.base.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveUsdcGhoRewarder,
    },
    {
      ...allow.base.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveUsdcGhoRewarder,
    },
    {
      ...allow.base.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveUsdcGhoRewarder,
    },

    // Balancer v3 - Aave Boosted GHO/USDC
    // permit2 is the same contract address across chains, so using contracts.mainnet.uniswap.permit2 is valid
    allowErc20Approve([GHO, USDC], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC),
      contracts.base.balancerV3.compositeLiquidityRouter
    ),
    allow.base.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveUsdcGho
    ),
    allow.base.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveUsdcGho
    ),
    allowErc20Approve(
      [balancerV3.aaveUsdcGho],
      [contracts.base.balancerV3.compositeLiquidityRouter]
    ),
    allow.base.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveUsdcGho
    ),
    allowErc20Approve([balancerV3.aaveUsdcGho], [balancerV3.aaveUsdcGhoGauge]),
    {
      ...allow.base.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveUsdcGhoGauge,
    },
    {
      ...allow.base.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveUsdcGhoGauge,
    },
    {
      ...allow.base.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveUsdcGhoGauge,
    },

    // Morpho Blue - cbBTC/USDC
    allowErc20Approve([USDC], [contracts.mainnet.morpho.morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: cbBTC,
        oracle: morpho.oracleCbBtcUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: cbBTC,
        oracle: morpho.oracleCbBtcUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    // Morpho Blue - cbETH/USDC
    allow.mainnet.morpho.morphoBlue.supply(
      {
        loanToken: USDC,
        collateralToken: cbETH,
        oracle: morpho.oracleCbEthUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: cbETH,
        oracle: morpho.oracleCbEthUsdc,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),

    /*********************************************
     * Bridges
     *********************************************/
    // USDC - Stargate to Mainnet
    allowErc20Approve([USDC], [contracts.base.stargate.poolUsdc]),
    allow.base.stargate.poolUsdc.send(
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
