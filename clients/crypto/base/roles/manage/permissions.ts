import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { DAI, USDC, cbETH, morpho } from "../../../../../eth-sdk/addresses_base"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Aave v3 - Deposit DAI
  ...allowErc20Approve([DAI], [contracts.base.aave_v3.pool_v3]),
  allow.base.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    DAI,
    undefined,
    c.avatar
  ),
  allow.base.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    DAI,
    undefined,
    c.avatar
  ),
  allow.base.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    DAI
  ),
  // Aave v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.base.aave_v3.pool_v3]),
  allow.base.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.base.aave_v3.pool_v3["withdraw(address,uint256,address)"](
    USDC,
    undefined,
    c.avatar
  ),
  allow.base.aave_v3.pool_v3["setUserUseReserveAsCollateral(address,bool)"](
    USDC
  ),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.base.compound_v3.cUSDCv3]),
  allow.base.compound_v3.cUSDCv3.supply(USDC),
  allow.base.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.base.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Morpho Blue - cbETH/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morpho_blue]),
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.Oracle_cbETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: cbETH,
      oracle: morpho.Oracle_cbETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    c.avatar
  ),

  /*********************************************
   * Bridge
   *********************************************/
  // Base -> Mainnet
  // USDC (Base) -> USDC (Mainnet)
  ...allowErc20Approve([USDC], [contracts.base.circle_token_messenger]),
  allow.base.circle_token_messenger.depositForBurn(
    undefined,
    0,
    "0x" + c.avatar.toString().slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
