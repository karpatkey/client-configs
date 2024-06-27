import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { DAI, USDC } from "../../../../../eth-sdk/addresses_opt"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar as avatar_eth } from "../../../eth/index"

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
  allow.optimism.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    DAI,
    undefined,
    c.avatar
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
  allow.optimism.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.optimism.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    USDC
  ),

  // Bridge - Optimism -> Mainnet
  // USDC (Optimism) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.optimism.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + avatar_eth.slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
