import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, USDC } from "../../../../../eth-sdk/addresses_arb"
import {
  COMP as COMP_eth,
  DAI as DAI_eth,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Cowswap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [DAI, USDC],
    buy: [DAI, USDC],
  }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Aave v3 - Deposit DAI
  ...allowErc20Approve([DAI], [contracts.arbitrumOne.aave_v3.pool_v3]),
  allow.arbitrumOne.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    DAI,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    DAI,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3[
    "setUserUseReserveAsCollateral(address,bool)"
  ](DAI),
  // Aave v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.aave_v3.pool_v3]),
  allow.arbitrumOne.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3[
    "setUserUseReserveAsCollateral(address,bool)"
  ](USDC),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.compound_v3.cUSDCv3]),
  allow.arbitrumOne.compound_v3.cUSDCv3.supply(USDC),
  allow.arbitrumOne.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.arbitrumOne.compound_v3.CometRewards.claim(undefined, c.avatar),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - USDC/DAI/USDT/USDC.e pool - Swap DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.balancer.vault]),
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x423a1323c871abc9d89eb06855bf5347048fc4a5000000000000000000000496",
      assetIn: c.or(DAI, USDC),
      assetOut: c.or(DAI, USDC),
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Uniswap v3 - Swap DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.uniswap_v3.router_2]),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(DAI, USDC),
    tokenOut: c.or(DAI, USDC),
    recipient: c.avatar,
  }),

  /*********************************************
   * Bridge
   *********************************************/
  // Arbitrum -> Mainnet
  // DAI (Arbitrum) -> DAI (Mainnet)
  ...allowErc20Approve([DAI], [contracts.arbitrumOne.gateway_router]),
  allow.arbitrumOne.gateway_router[
    "outboundTransfer(address,address,uint256,bytes)"
  ](DAI_eth, c.avatar, undefined, "0x"),
  // COMP (Arbitrum) -> COMP (Mainnet)
  ...allowErc20Approve([COMP], [contracts.arbitrumOne.gateway_router]),
  allow.arbitrumOne.gateway_router[
    "outboundTransfer(address,address,uint256,bytes)"
  ](COMP_eth, c.avatar, undefined, "0x"),
  // USDC (Arbitrum) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.circle_token_messenger]),
  allow.arbitrumOne.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Mainnet
  allow.mainnet.circle_message_transmitter.receiveMessage(
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
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x000000000000000000000000bd3fa8",
      }),
      c.bitmask({
        shift: 20 + 15,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x1b58ba92a82136038b25adec7066af",
      }),
      c.bitmask({
        shift: 20 + 15 + 15,
        mask: "0xffff",
        value: "0x3155",
      }),
      // recipient: 32 bytes
      // Circle Token Messenger (Arbitrum)
      c.bitmask({
        shift: 20 + 32,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x00000000000000000000000019330d",
      }),
      c.bitmask({
        shift: 20 + 32 + 15,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x10d9cc8751218eaf51e8885d058642",
      }),
      c.bitmask({
        shift: 20 + 32 + 15 + 15,
        mask: "0xffff",
        value: "0xe08a",
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      c.bitmask({
        shift: 20 + 32 + 32 + 36,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x000000000000000000000000a0b869",
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 15,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x91c6218b36c1d19d4a2e9eb0ce3606",
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 15 + 15,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0xeb48",
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
] satisfies PermissionList
