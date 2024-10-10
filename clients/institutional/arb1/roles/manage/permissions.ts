import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, USDC, USDCe } from "../../../../../eth-sdk/addresses_arb"
import {
  COMP as COMP_eth,
  DAI as DAI_eth,
  USDC as USDC_eth,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [COMP, DAI, USDC, USDCe],
    buy: [DAI, USDC, USDCe],
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
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0000", // DAI assetId: 0
    })
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
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x000c", // USDC assetId: 12
    })
  ),
  allow.arbitrumOne.aave_v3.pool_v3[
    "setUserUseReserveAsCollateral(address,bool)"
  ](USDC),
  // Aave v3 - Deposit USDC.e
  ...allowErc20Approve([USDCe], [contracts.arbitrumOne.aave_v3.pool_v3]),
  allow.arbitrumOne.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDCe,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0002", // USDC.e assetId: 2
    })
  ),
  allow.arbitrumOne.aave_v3.pool_v3[
    "setUserUseReserveAsCollateral(address,bool)"
  ](USDCe),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.compound_v3.cUSDCv3]),
  allow.arbitrumOne.compound_v3.cUSDCv3.supply(USDC),
  allow.arbitrumOne.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.arbitrumOne.compound_v3.CometRewards.claim(undefined, c.avatar),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - USDC/DAI/USDT/USDC.e pool - Swap DAI <-> USDC <-> USDC.e
  ...allowErc20Approve([DAI, USDC, USDCe], [contracts.mainnet.balancer.vault]),
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x423a1323c871abc9d89eb06855bf5347048fc4a5000000000000000000000496",
      assetIn: c.or(DAI, USDC, USDCe),
      assetOut: c.or(DAI, USDC, USDCe),
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Uniswap v3 - Swap DAI <-> USDC <-> USDC.e
  ...allowErc20Approve(
    [DAI, USDC, USDCe],
    [contracts.mainnet.uniswap_v3.router_2]
  ),
  allow.mainnet.uniswap_v3.router_2.exactInputSingle({
    tokenIn: c.or(DAI, USDC, USDCe),
    tokenOut: c.or(DAI, USDC, USDCe),
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
  // DAI (Arbitrum) -> DAI (Mainnet) - HOP
  ...allowErc20Approve([DAI], [contracts.arbitrumOne.hop_dai_wrapper]),
  allow.arbitrumOne.hop_dai_wrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),
  // DAI (Arbitrum) -> DAI (Mainnet) - Connext
  ...allowErc20Approve([DAI], [contracts.arbitrumOne.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.arbitrumOne.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes)"
  ](
    6648936,
    c.avatar,
    DAI,
    c.avatar,
    undefined,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0"),
    {
      send: true,
    }
  ),
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
  allow.arbitrumOne.circle_message_transmitter.receiveMessage(
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
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // Circle Token Messenger (Arbitrum)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.arbitrumOne.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value:
          "0x" + contracts.arbitrumOne.circle_token_messenger.slice(22, 42),
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
  // USDC (Arbitrum) -> USDC (Mainnet) - HOP
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.l2_hop_cctp]),
  allow.arbitrumOne.l2_hop_cctp.send(
    1, // Mainnet
    c.avatar
  ),
  // USDC.e (Arbitrum) -> USDC (Mainnet) - Connext
  ...allowErc20Approve([USDCe], [contracts.arbitrumOne.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.arbitrumOne.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](6648936, c.avatar, USDCe, c.avatar, undefined, undefined, "0x"),
] satisfies PermissionList
