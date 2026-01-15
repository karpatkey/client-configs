import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  COMP,
  EUL,
  FLUID,
  sUSDai,
  sUSDC,
  sUSDS,
  syrupUSDC,
  USDai,
  USDC,
  USDCe,
  USDS,
  USDT,
  compoundV3,
  euler,
  fluid,
  pendle,
} from "@/addresses/arb1"
import { zeroAddress } from "@/addresses"
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
    allow.arbitrumOne.euler.vaultConnector.batch(
      c.matches([
        {
          targetContract: contracts.arbitrumOne.euler.rEul,
          onBehalfOfAccount: c.avatar,
          data: c.calldataMatches(
            allow.arbitrumOne.euler.rEul.withdrawToByLockTimestamp(c.avatar)
          ),
        },
      ])
    ),
    // Included for completeness
    allow.arbitrumOne.euler.rEul.withdrawToByLockTimestamp(c.avatar),
    // Included for completeness; not used by the UI
    allow.arbitrumOne.euler.rEul.withdrawToByLockTimestamps(c.avatar),
    // Included for completeness; not used by the UI
    allow.arbitrumOne.euler.rEul.withdrawTo(c.avatar),

    // Fluid - fGHO Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fGhoRewardsJul2025,
    },

    // Merkl - Rewards
    allow.arbitrumOne.merkl.angleDistributor.claim(
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

    // Pendle - syrupUSDC <-> PT-syrupUSDC-DDMMMYYYY / USDai <-> PT-USDai-DDMMMYYYY / sUSDai <-> PT-sUSDai-DDMMMYYYY
    allowErc20Approve([syrupUSDC, USDai, sUSDai], [contracts.arbitrumOne.pendle.routerV4]),
    allow.arbitrumOne.pendle.routerV4.swapExactTokenForPt(
      c.avatar,
      c.or(
        pendle.marketSyrupUsdc29Jan2026,
        pendle.marketUsDai19Feb2026,
        pendle.marketsUsDai19Feb2026,
      ),
      undefined,
      undefined,
      {
        tokenIn: c.or(syrupUSDC, USDai, sUSDai),
        tokenMintSy: c.or(syrupUSDC, USDai, sUSDai),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),
    allowErc20Approve(
      [
        pendle.ptSyrupUsdc29Jan2026,
        pendle.ptUsDai19Feb2026,
        pendle.ptsUsDai19Feb2026,
      ],
      [contracts.arbitrumOne.pendle.routerV4]
    ),
    allow.arbitrumOne.pendle.routerV4.swapExactPtForToken(
      c.avatar,
      c.or(
        pendle.marketSyrupUsdc29Jan2026,
        pendle.marketUsDai19Feb2026,
        pendle.marketsUsDai19Feb2026,
      ),
      undefined,
      {
        tokenOut: c.or(syrupUSDC, USDai, sUSDai),
        tokenRedeemSy: c.or(syrupUSDC, USDai, sUSDai),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),

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
    allowErc20Approve([USDC, USDS, sUSDS], [contracts.arbitrumOne.spark.psm3]),
    // Deposit USDC or USDS / Withdraw all USDC or USDS
    allow.arbitrumOne.spark.psm3.swapExactIn(
      c.or(sUSDS, USDC, USDS),
      c.or(sUSDS, USDC, USDS),
      undefined,
      undefined,
      c.avatar
    ),
    // Withdraw a specific amount of USDC or USDS
    allow.arbitrumOne.spark.psm3.swapExactOut(sUSDS, c.or(USDC, USDS)),

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
    allowErc20Approve([EUL], [contracts.arbitrumOne.euler.oftAdapter]),
    allow.arbitrumOne.euler.oftAdapter.send(
      {
        dstEid: "30101", // Ethereum
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        extraOptions: c.or("0x", "0x0003"), // https://arbiscan.io/address/0x174834a9DE4C2f0c13c7353e62C229E8D607c808#code#F9#L91
        composeMsg: "0x",
        oftCmd: "0x",
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),

    // COMP - Arbitrum Bridge
    allowErc20Approve(
      [COMP],
      [contracts.arbitrumOne.arbitrumBridge.gatewayRouter]
    ),
    allow.arbitrumOne.arbitrumBridge.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](COMP_eth, c.avatar, undefined, "0x"),
  ] satisfies PermissionList
