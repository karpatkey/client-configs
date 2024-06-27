import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, USDC } from "../../../../../eth-sdk/addresses_arb"
import {
  COMP as COMP_eth,
  DAI as DAI_eth,
  USDC as USDC_eth,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar as avatar_eth } from "../../../eth/index"

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

  // Bridge - Arbitrum -> Mainnet
  // DAI (Arbitrum) -> DAI (Mainnet)
  ...allowErc20Approve([DAI], [contracts.arbitrumOne.gateway_router]),
  allow.arbitrumOne.gateway_router[
    "outboundTransfer(address,address,uint256,bytes)"
  ](DAI_eth, avatar_eth, undefined, "0x"),
  // COMP (Arbitrum) -> COMP (Mainnet)
  ...allowErc20Approve([COMP], [contracts.arbitrumOne.gateway_router]),
  allow.arbitrumOne.gateway_router[
    "outboundTransfer(address,address,uint256,bytes)"
  ](COMP_eth, avatar_eth, undefined, "0x"),
  // USDC (Arbitrum) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.arbitrumOne.circle_token_messenger]),
  allow.arbitrumOne.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + avatar_eth.slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
