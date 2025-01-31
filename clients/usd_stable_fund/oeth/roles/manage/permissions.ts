import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/oeth"
import {
  crvUSD,
  DAI,
  USDC,
  USDCe,
  balancer,
} from "../../../../../eth-sdk/addresses/oeth"
import { USDC as USDC_eth } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"
import { balancerSwap } from "@/exit_strategies/balancer"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - [DAI, USDC, USDCe] <-> [DAI, USDC, USDCe]
  balancerSwap(balancer.stableBeetsPid, [DAI, USDC, USDCe], [DAI, USDC, USDCe]),

  // Curve - DAI <-> USDC.e
  ...allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.x3CrvPool]),
  allow.optimism.curve.x3CrvPool["exchange(int128,int128,uint256,uint256)"](
    c.or(0, 1), // 0 = DAI, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - crvUSDC <-> USDC
  ...allowErc20Approve(
    [crvUSD, USDC],
    [contracts.optimism.curve.crvUsdUsdcPool]
  ),
  allow.optimism.curve.crvUsdUsdcPool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC
    c.or(0, 1)
  ),

  // Curve - crvUSDC <-> USDC.e
  ...allowErc20Approve(
    [crvUSD, USDCe],
    [contracts.optimism.curve.crvUsdUsdcePool]
  ),
  allow.optimism.curve.crvUsdUsdcePool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - DAI <-> USDC.e
  ...allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.sUsd3CrvPool]),
  allow.optimism.curve.sUsd3CrvPool[
    "exchange_underlying(int128,int128,uint256,uint256)"
  ](
    c.or(1, 2), // 1 = DAI, 2 = USDC.e
    c.or(1, 2)
  ),

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.optimism.navCalculator.bridgeStart(),

  // Optimism -> Mainnet
  // DAI (Optimism) -> DAI (Mainnet)
  ...allowErc20Approve([DAI], [contracts.optimism.daiTokenBridge]),
  allow.optimism.daiTokenBridge.withdraw(DAI),
  allow.optimism.daiTokenBridge.withdrawTo(DAI, c.avatar),
  // DAI (Optimism) -> DAI (Mainnet) - HOP
  ...allowErc20Approve([DAI], [contracts.optimism.hopDaiWrapper]),
  allow.optimism.hopDaiWrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),

  // USDC (Optimism) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.optimism.circleTokenMessenger]),
  allow.optimism.circleTokenMessenger.depositForBurn(
    undefined,
    0,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Mainnet
  allow.optimism.circleMessageTransmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000000)
      // destination domain: 4 bytes (00000002)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000000000002",
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
      // Circle Token Messenger (Optimism)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.optimism.circleTokenMessenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.optimism.circleTokenMessenger.slice(22, 42),
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
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Optimism) -> USDC (Mainnet) - HOP
  ...allowErc20Approve([USDC], [contracts.optimism.l2HopCctp]),
  allow.optimism.l2HopCctp.send(
    1, // Mainnet
    c.avatar
  ),
] satisfies PermissionList
