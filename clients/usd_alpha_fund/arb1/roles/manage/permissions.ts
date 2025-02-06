import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/arb1"
import { COMP, DAI, USDC, USDCe, balancer } from "@/addresses/arb1"
import {
  COMP as COMP_eth,
  DAI as DAI_eth,
  USDC as USDC_eth,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"
import { balancerSwap } from "@/exit_strategies/balancer"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * DeFi-Kit permissions
     *********************************************/
    // Aave v3 - Deposit DAI
    allowAction.aave_v3.deposit({ targets: ["DAI"] }),
    // Aave v3 - Deposit GHO
    allowAction.aave_v3.deposit({ targets: ["GHO"] }),
    // Aave v3 - Deposit USDC
    allowAction.aave_v3.deposit({ targets: ["USDC"] }),
    // Aave v3 - Deposit USDC.e
    allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),
    // Aave v3 - Deposit USDT
    allowAction.aave_v3.deposit({ targets: ["USDT"] }),

    // CowSwap - [COMP, DAI, USDC, USDCe] -> [DAI, USDC, USDCe]
    allowAction.cowswap.swap({
      sell: [COMP, DAI, USDC, USDCe],
      buy: [DAI, USDC, USDCe],
    }),

    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Compound v3 - Deposit USDC
    ...allowErc20Approve([USDC], [contracts.arbitrumOne.compoundV3.cUsdcV3]),
    allow.arbitrumOne.compoundV3.cUsdcV3.supply(USDC),
    allow.arbitrumOne.compoundV3.cUsdcV3.withdraw(USDC),
    // Compound v3 - Claim rewards
    allow.arbitrumOne.compoundV3.cometRewards.claim(undefined, c.avatar),

    // Gyroscope - Staking/Unstaking GYD
    allow.arbitrumOne.gyroscope.sGyd.deposit(undefined, c.avatar),
    allow.arbitrumOne.gyroscope.sGyd.redeem(undefined, c.avatar, c.avatar),
    // Gyroscope - Staking/Unstaking sGYD
    allow.arbitrumOne.gyroscope.stSgyd.deposit(undefined, c.avatar),
    allow.arbitrumOne.gyroscope.stSgyd.withdraw(undefined, c.avatar, c.avatar),
    // Gyroscope - Claim ARB
    allow.arbitrumOne.gyroscope.stSgyd.claimRewards(),

    /*********************************************
     * Swaps
     *********************************************/
    // Balancer - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
    balancerSwap(balancer.b4PoolPid, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

    // Uniswap v3 - [DAI, USDC, USDC.e] <-> [DAI, USDC, USDC.e]
    ...allowErc20Approve(
      [DAI, USDC, USDCe],
      [contracts.mainnet.uniswapV3.router2]
    ),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(DAI, USDC, USDCe),
      tokenOut: c.or(DAI, USDC, USDCe),
      recipient: c.avatar,
    }),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.arbitrumOne.navCalculator.bridgeStart(),

    // Arbitrum -> Mainnet
    // DAI (Arbitrum) -> DAI (Mainnet)
    ...allowErc20Approve([DAI], [contracts.arbitrumOne.gatewayRouter]),
    allow.arbitrumOne.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](DAI_eth, c.avatar, undefined, "0x"),
    // DAI (Arbitrum) -> DAI (Mainnet) - HOP
    ...allowErc20Approve([DAI], [contracts.arbitrumOne.hopDaiWrapper]),
    allow.arbitrumOne.hopDaiWrapper.swapAndSend(
      1, // Mainnet
      c.avatar
    ),

    // COMP (Arbitrum) -> COMP (Mainnet)
    ...allowErc20Approve([COMP], [contracts.arbitrumOne.gatewayRouter]),
    allow.arbitrumOne.gatewayRouter[
      "outboundTransfer(address,address,uint256,bytes)"
    ](COMP_eth, c.avatar, undefined, "0x"),

    // USDC (Arbitrum) -> USDC (Mainnet)
    ...allowErc20Approve([USDC], [contracts.arbitrumOne.circleTokenMessenger]),
    allow.arbitrumOne.circleTokenMessenger.depositForBurn(
      undefined,
      0,
      "0x" + parameters.avatar.slice(2).padStart(64, "0"),
      USDC
    ),
    // Claim bridged USDC from Mainnet
    allow.arbitrumOne.circleMessageTransmitter.receiveMessage(
      c.and(
        // version: 4 bytes (00000000)
        // source domain: 4 bytes(00000000)
        // destination domain: 4 bytes (00000003)
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffffffff",
          value: "0x000000000000000000000003",
        }),
        // skip nonce 8 bytes
        // sender: 32 bytes
        // skip the first 12 bytes of the address with 0's
        // Circle Token Messenger (Mainnet)
        c.bitmask({
          shift: 20 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.mainnet.circleTokenMessenger.slice(22, 42),
        }),
        // recipient: 32 bytes
        // Circle Token Messenger (Arbitrum)
        c.bitmask({
          shift: 20 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: contracts.arbitrumOne.circleTokenMessenger.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.arbitrumOne.circleTokenMessenger.slice(22, 42),
        }),
        // message body: dynamic
        // skip selector (4 bytes) + 32 bytes chunk with 0
        // Bridged Token: USDC
        // skip the first 12 bytes of the address with 0's
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC_eth.slice(0, 22),
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC_eth.slice(22, 42),
        }),
        // Avatar address
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes chunk with 0
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
    // USDC (Arbitrum) -> USDC (Mainnet) - HOP
    ...allowErc20Approve([USDC], [contracts.arbitrumOne.l2HopCctp]),
    allow.arbitrumOne.l2HopCctp.send(
      1, // Mainnet
      c.avatar
    ),
  ] satisfies PermissionList
