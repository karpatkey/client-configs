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
  ] satisfies PermissionList
