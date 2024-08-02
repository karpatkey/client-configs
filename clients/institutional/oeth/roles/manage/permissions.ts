import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  crvUSD,
  DAI,
  COMP,
  USDC,
  USDCe,
} from "../../../../../eth-sdk/addresses_opt"
import { USDC as USDC_eth } from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Aave v3 - Deposit DAI
  ...allowErc20Approve([DAI], [contracts.optimism.aave_v3.pool_v3]),
  allow.optimism.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    DAI,
    undefined,
    c.avatar
  ),
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0000", // DAI assetId: 0
    })
  ),
  allow.optimism.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    DAI
  ),
  // Aave v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.optimism.aave_v3.pool_v3]),
  allow.optimism.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x000d", // USDC assetId: 13
    })
  ),
  allow.optimism.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    USDC
  ),
  // Aave v3 - Deposit USDC.e
  ...allowErc20Approve([USDCe], [contracts.optimism.aave_v3.pool_v3]),
  allow.optimism.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDCe,
    undefined,
    c.avatar
  ),
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0002", // USDC.e assetId: 2
    })
  ),
  allow.optimism.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    USDCe
  ),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.optimism.compound_v3.cUSDCv3]),
  allow.optimism.compound_v3.cUSDCv3.supply(USDC),
  allow.optimism.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.optimism.compound_v3.CometRewards.claim(undefined, c.avatar),

  /*********************************************
   * Swaps
   *********************************************/
  // Balancer - USDC/USDC.e/DAI/USDT pool - Swap USDC <-> USDC.e <-> DAI
  ...allowErc20Approve([DAI, USDC, USDCe], [contracts.mainnet.balancer.vault]),
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x9da11ff60bfc5af527f58fd61679c3ac98d040d9000000000000000000000100",
      assetIn: c.or(DAI, USDC, USDCe),
      assetOut: c.or(DAI, USDC, USDCe),
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Curve - 3pool - Swap DAI <-> USDC.e
  ...allowErc20Approve([DAI, USDCe], [contracts.optimism.curve.x3CRV_pool]),
  allow.optimism.curve.x3CRV_pool["exchange(int128,int128,uint256,uint256)"](
    c.or(0, 1), // 0 = DAI, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - crvUSDC/USDC - Swap crvUSDC <-> USDC
  ...allowErc20Approve(
    [crvUSD, USDC],
    [contracts.optimism.curve.crvUSD_USDC_pool]
  ),
  allow.optimism.curve.crvUSD_USDC_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC
    c.or(0, 1)
  ),

  // Curve - crvUSDC/USDC.e - Swap crvUSDC <-> USDC.e
  ...allowErc20Approve(
    [crvUSD, USDCe],
    [contracts.optimism.curve.crvUSD_USDCe_pool]
  ),
  allow.optimism.curve.crvUSD_USDCe_pool[
    "exchange(int128,int128,uint256,uint256)"
  ](
    c.or(0, 1), // 0 = crvUSDC, 1 = USDC.e
    c.or(0, 1)
  ),

  // Curve - sUSD Synthetix - Swap DAI <-> USDC.e
  ...allowErc20Approve(
    [DAI, USDCe],
    [contracts.optimism.curve.sUSD3CRV_f_pool]
  ),
  allow.optimism.curve.sUSD3CRV_f_pool[
    "exchange_underlying(int128,int128,uint256,uint256)"
  ](
    c.or(1, 2), // 1 = DAI, 2 = USDC.e
    c.or(1, 2)
  ),

  /*********************************************
   * Bridge
   *********************************************/
  // Optimism -> Mainnet
  // DAI (Optimism) -> DAI (Mainnet)
  ...allowErc20Approve([DAI], [contracts.optimism.dai_token_bridge]),
  allow.optimism.dai_token_bridge.withdraw(DAI),
  allow.optimism.dai_token_bridge.withdrawTo(DAI, c.avatar),
  // DAI (Optimism) -> DAI (Mainnet) - HOP
  ...allowErc20Approve([DAI], [contracts.optimism.hop_dai_wrapper]),
  allow.optimism.hop_dai_wrapper.swapAndSend(
    1, // Mainnet
    c.avatar
  ),
  // DAI (Optimism) -> DAI (Mainnet) - Connext
  ...allowErc20Approve([DAI], [contracts.optimism.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.optimism.connext_bridge[
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
  // COMP (Optimism) -> COMP (Mainnet)
  ...allowErc20Approve([COMP], [contracts.optimism.optimism_bridge]),
  allow.optimism.optimism_bridge.withdraw(DAI),
  allow.optimism.optimism_bridge.withdrawTo(DAI, c.avatar),
  // USDC (Optimism) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.optimism.circle_token_messenger]),
  allow.optimism.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Mainnet
  allow.optimism.circle_message_transmitter.receiveMessage(
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
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // Circle Token Messenger (Optimism)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.optimism.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.optimism.circle_token_messenger.slice(22, 42),
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
  ...allowErc20Approve([USDC], [contracts.optimism.l2_hop_cctp]),
  allow.optimism.l2_hop_cctp.send(
    1, // Mainnet
    c.avatar
  ),
  // USDC.e (Optimism) -> USDC (Mainnet) - Connext
  ...allowErc20Approve([USDCe], [contracts.optimism.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.optimism.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](6648936, c.avatar, USDCe, c.avatar, undefined, undefined, "0x"),
] satisfies PermissionList
