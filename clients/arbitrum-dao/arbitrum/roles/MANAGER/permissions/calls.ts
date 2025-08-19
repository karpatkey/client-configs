import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COMP,
  FLUID,
  sUSDC,
  sUSDS,
  USDC,
  USDCe,
  USDT,
  compoundV3,
  euler,
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

    // Spark - sUSDS
    allowErc20Approve([USDC, sUSDS], [contracts.arbitrumOne.spark.psm3]),
    // Deposit USDC / Withdraw all USDC
    allow.arbitrumOne.spark.psm3.swapExactIn(
      c.or(sUSDS, USDC),
      c.or(sUSDS, USDC),
      undefined,
      undefined,
      c.avatar
    ),
    allow.arbitrumOne.spark.psm3.swapExactOut(sUSDS, USDC),

    /*********************************************
     * Swaps
     *********************************************/
    // FluidDexT1 - FLUID -> ETH
    allowErc20Approve([FLUID], [contracts.arbitrumOne.fluid.fluidDexT1]),
    allow.arbitrumOne.fluid.fluidDexT1.swapIn(
      true,
      undefined,
      undefined,
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
        extraOptions: c.or("0x", "0x0003"), // https://arbiscan.io/address/0x174834a9DE4C2f0c13c7353e62C229E8D607c808#code#F9#L91
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
