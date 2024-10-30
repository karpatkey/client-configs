import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDT } from "../../../../../eth-sdk/addresses_arb"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Aave v3 - Deposit USDT
  ...allowErc20Approve([USDT], [contracts.arbitrumOne.aave_v3.pool_v3]),
  allow.arbitrumOne.aave_v3.pool_v3["supply(address,uint256,address,uint16)"](
    USDT,
    undefined,
    c.avatar
  ),
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0005", // USDT assetId: 5
    })
  ),

  // Gyroscope - Staking/Unstaking GYD
  allow.arbitrumOne.gyroscope.sGYD.deposit(undefined, c.avatar),
  allow.arbitrumOne.gyroscope.sGYD.redeem(undefined, c.avatar, c.avatar),
  // Gyroscope - Staking/Unstaking sGYD
  allow.arbitrumOne.gyroscope.st_sGYD.deposit(undefined, c.avatar),
  allow.arbitrumOne.gyroscope.st_sGYD.withdraw(undefined, c.avatar, c.avatar),
  // Gyroscope - Claim ARB
  allow.arbitrumOne.gyroscope.st_sGYD.claimRewards(),
] satisfies PermissionList
