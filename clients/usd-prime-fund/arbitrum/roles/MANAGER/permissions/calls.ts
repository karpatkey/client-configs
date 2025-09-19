import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
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
    // Arbitrum -> Mainnet
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.arbitrumOne.chainlink.router]),
    allow.arbitrumOne.chainlink.router.ccipSend(
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

    // Arbitrum -> Gnosis Chain
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.arbitrumOne.chainlink.router]),
    allow.arbitrumOne.chainlink.router.ccipSend(
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

    // Arbitrum -> Base
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.arbitrumOne.chainlink.router]),
    allow.arbitrumOne.chainlink.router.ccipSend(
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
  ] satisfies PermissionList
