import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  GHO,
  sUSDS,
  USDC,
  USDCe,
  USDT,
  compoundV3,
  euler,
  fluid,
} from "@/addresses/arb1"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../../arbitrum/parameters"

export default (parameters: Parameters) =>
  [
    // Compound v3 - USDC
    allowErc20Approve([USDC], [compoundV3.cUsdcV3]),
    {
      ...allow.arbitrumOne.compoundV3.comet.supply(USDC),
      targetAddress: compoundV3.cUsdcV3,
    },
    {
      ...allow.arbitrumOne.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.cUsdcV3,
    },

    // Compound v3 - USDC.e
    allowErc20Approve([USDCe], [compoundV3.cUsdceV3]),
    {
      ...allow.arbitrumOne.compoundV3.comet.supply(USDCe),
      targetAddress: compoundV3.cUsdceV3,
    },
    {
      ...allow.arbitrumOne.compoundV3.comet.withdraw(USDCe),
      targetAddress: compoundV3.cUsdceV3,
    },

    // Compound v3 - USDT
    allowErc20Approve([USDT], [compoundV3.cUsdtV3]),
    {
      ...allow.arbitrumOne.compoundV3.comet.supply(USDT),
      targetAddress: compoundV3.cUsdtV3,
    },
    {
      ...allow.arbitrumOne.compoundV3.comet.withdraw(USDT),
      targetAddress: compoundV3.cUsdtV3,
    },

    // Compound v3 - Claim COMP rewards
    allow.arbitrumOne.compoundV3.cometRewards.claim(undefined, c.avatar),

    // Fluid - GHO
    allowErc20Approve([GHO], [fluid.fGho]),
    {
      ...allow.arbitrumOne.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fGho,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fGho,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fGho,
    },

    // Fluid - sUSDS
    allowErc20Approve([sUSDS], [fluid.fsUsds]),
    {
      ...allow.arbitrumOne.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fsUsds,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fsUsds,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fsUsds,
    },

    // Fluid - USDC
    allowErc20Approve([USDC], [fluid.fUsdc]),
    {
      ...allow.arbitrumOne.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdc,
    },

    // Fluid - USDT
    allowErc20Approve([USDT], [fluid.fUsdt]),
    {
      ...allow.arbitrumOne.fluid.fAsset["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },
    {
      ...allow.arbitrumOne.fluid.fAsset["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fluid.fUsdt,
    },

    // Fluid - Claim FLUID rewards
    allow.arbitrumOne.fluid.merkleDistributor.claim(c.avatar),

    // Spark - sUSDC
    allowErc20Approve([USDC], [contracts.arbitrumOne.spark.sUSDC]),
    allow.arbitrumOne.spark.sUSDC["deposit(uint256,address,uint256,uint16)"](
      undefined,
      c.avatar
    ),
    allow.arbitrumOne.spark.sUSDC["withdraw(uint256,address,address,uint256)"](
      undefined,
      c.avatar
    ),
    allow.arbitrumOne.spark.sUSDC["redeem(uint256,address,address,uint256)"](
      undefined,
      c.avatar,
      c.avatar
    ),
  ] satisfies PermissionList
