import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
import {
  GHO,
  USDC,
  aura,
  balancerV3,
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

    // Merkl - Rewards
    allow.base.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar]
      )
    ),

    /*********************************************
     * Bridges
     *********************************************/
    // Base -> Mainnet
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.base.chainlink.router]),
    allow.base.chainlink.router.ccipSend(
      "5009297550715157269", // https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
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

    // Base -> Arbitrum
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.base.chainlink.router]),
    allow.base.chainlink.router.ccipSend(
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

    // Base -> Gnosis Chain
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.base.chainlink.router]),
    allow.base.chainlink.router.ccipSend(
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
  ] satisfies PermissionList
