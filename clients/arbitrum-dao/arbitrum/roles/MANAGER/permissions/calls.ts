import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COMP,
  GHO,
  sUSDC,
  sUSDS,
  USDC,
  USDCe,
  USDT,
  compoundV3,
  euler,
  fluid,
} from "@/addresses/arb1"
import { COMP as COMP_eth } from "@/addresses/eth"
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

    // // Euler - Vault Connector - batch
    // allow.arbitrumOne.euler.vaultConnector.batch(
    //   c.every(
    //     {
    //       targetContract: c.or(
    //         contracts.arbitrumOne.euler.termsOfUseSigner,
    //         euler.esUsdc,
    //         euler.esUsds,
    //         euler.eUsdc,
    //         euler.eUsdt
    //       ),
    //       onBehalfOfAccount: c.avatar,
    //       value: 0,
    //       data: c.or(
    //         c.calldataMatches(
    //           allow.arbitrumOne.euler.termsOfUseSigner.signTermsOfUse()
    //         ),
    //         c.calldataMatches(
    //           allow.arbitrumOne.euler.eVault.deposit(
    //             undefined,
    //             c.avatar
    //           )
    //         ),
    //         c.calldataMatches(
    //           allow.arbitrumOne.euler.eVault.withdraw(
    //             undefined,
    //             c.avatar,
    //             c.avatar
    //           )
    //         ),
    //         c.calldataMatches(
    //           allow.arbitrumOne.euler.eVault.redeem(
    //             undefined,
    //             c.avatar,
    //             c.avatar
    //           )
    //         )
    //       )
    //     }
    //   )
    // ),

    // Euler - sUSDC
    allowErc20Approve([sUSDC], [euler.esUsdc]),
    {
      ...allow.arbitrumOne.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.esUsdc,
    },
    {
      ...allow.arbitrumOne.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.esUsdc,
    },
    {
      ...allow.arbitrumOne.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.esUsdc,
    },

    // Euler - sUSDS
    allowErc20Approve([sUSDS], [euler.esUsds]),
    {
      ...allow.arbitrumOne.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.esUsds,
    },
    {
      ...allow.arbitrumOne.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.esUsds,
    },
    {
      ...allow.arbitrumOne.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.esUsds,
    },

    // Euler - USDC
    allowErc20Approve([USDC], [euler.eUsdc]),
    {
      ...allow.arbitrumOne.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.eUsdc,
    },
    {
      ...allow.arbitrumOne.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.eUsdc,
    },
    {
      ...allow.arbitrumOne.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.eUsdc,
    },

    // Euler - USDT
    allowErc20Approve([USDT], [euler.eUsdt]),
    {
      ...allow.arbitrumOne.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.eUsdt,
    },
    {
      ...allow.arbitrumOne.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.eUsdt,
    },
    {
      ...allow.arbitrumOne.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.eUsdt,
    },

    // Euler - Claim rEUL
    // claimAll (0x24a76995) - This is the function used by the UI
    allow.arbitrumOne.euler.claimAll[
      "claimAll(address,address[],(address,uint256[],uint64,bytes32[])[])"
    ](c.avatar),
    // claimAll (0x13e7e058) - Included for completeness; not used by the UI
    allow.arbitrumOne.euler.claimAll["claimAll(address,address[])"](c.avatar),
    // claimAll (0xcb417671) - Included for completeness; not used by the UI
    allow.arbitrumOne.euler.claimAll[
      "claimAll(address,(address,uint256[],uint64,bytes32[])[])"
    ](c.avatar),

    // Euler - Unlock rEUL to EUL
    // This is the function used by the UI
    allow.arbitrumOne.euler.rEul.withdrawToByLockTimestamp(c.avatar),
    // Included for completeness; not used by the UI
    allow.arbitrumOne.euler.rEul.withdrawToByLockTimestamps(c.avatar),
    // Included for completeness; not used by the UI
    allow.arbitrumOne.euler.rEul.withdrawTo(c.avatar),

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
    allowErc20Approve([USDC], [sUSDC]),
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

    /*********************************************
     * Bridge
     *********************************************/
    // Arbitrum -> Mainnet
    // EUL - Stargate
    // https://docs.layerzero.network/v2/developers/evm/oft/oft-patterns-extensions#sending-token
    // https://docs.stargate.finance/developers/protocol-docs/transfer
    allow.arbitrumOne.euler.oftAdapter.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: "0x0003", // https://arbiscan.io/address/0x174834a9DE4C2f0c13c7353e62C229E8D607c808#code#F9#L91
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar
    ),

    // COMP - Arbitrum Bridge
    ...allowErc20Approve([COMP], [contracts.arbitrumOne.gatewayRouter]),
    allow.arbitrumOne.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](COMP_eth, c.avatar, undefined, "0x"),
  ] satisfies PermissionList
