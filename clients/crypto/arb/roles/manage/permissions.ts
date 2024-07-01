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

  // Balancer - USDC/DAI/USDT/USDC.e pool - Swap DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.balancer.vault]),
  // Swap DAI for USDC
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x423a1323c871abc9d89eb06855bf5347048fc4a5000000000000000000000496",
      assetIn: DAI,
      assetOut: USDC,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),
  // Swap USDC for DAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x423a1323c871abc9d89eb06855bf5347048fc4a5000000000000000000000496",
      assetIn: USDC,
      assetOut: DAI,
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

  // Bridge - Arbitrum -> Mainnet
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
    "0x" + c.avatar.toString().slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
