import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { DAI, COMP, USDC } from "../../../../../eth-sdk/addresses_opt"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

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

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.optimism.compound_v3.cUSDCv3]),
  allow.optimism.compound_v3.cUSDCv3.supply(USDC),
  allow.optimism.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.optimism.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Bridge - Optimism -> Mainnet
  // DAI (Optimism) -> DAI (Mainnet)
  ...allowErc20Approve([DAI], [contracts.optimism.dai_token_bridge]),
  allow.optimism.dai_token_bridge.withdraw(DAI),
  allow.optimism.dai_token_bridge.withdrawTo(DAI, c.avatar),
  // COMP (Optimism) -> COMP (Mainnet)
  ...allowErc20Approve([COMP], [contracts.optimism.optimism_bridge]),
  allow.optimism.optimism_bridge.withdraw(DAI),
  allow.optimism.optimism_bridge.withdrawTo(DAI, c.avatar),
  // USDC (Optimism) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.optimism.circle_token_messenger]),
  allow.optimism.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + c.avatar.toString().slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
