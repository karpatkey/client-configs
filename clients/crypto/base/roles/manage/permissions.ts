import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { DAI, USDC, cbETH, morpho } from "../../../../../eth-sdk/addresses_base"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

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
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Mainnet
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000000)
      // destination domain: 4 bytes (00000006)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000000000006",
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
      // Circle Token Messenger (Base)
      c.bitmask({
        shift: 20 + 32,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x0000000000000000000000001682ae",
      }),
      c.bitmask({
        shift: 20 + 32 + 15,
        mask: "0xffffffffffffffffffffffffffffff",
        value: "0x6375c4e4a97e4b583bc394c861a46d",
      }),
      c.bitmask({
        shift: 20 + 32 + 15 + 15,
        mask: "0xffff",
        value: "0x8962",
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
