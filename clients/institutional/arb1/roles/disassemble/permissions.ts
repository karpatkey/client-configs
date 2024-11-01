import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "../../../../../eth-sdk/addresses_arb"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v3 - Withdraw DAI
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 2 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0000", // DAI assetId: 0
    })
  ),
  // Aave v3 - Withdraw USDC
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 2 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x000c", // USDC assetId: 12
    })
  ),
  // Aave v3 - Withdraw USDC.e
  allow.arbitrumOne.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 2 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0002", // USDC.e assetId: 2
    })
  ),

  // Compound v3 - Withdraw USDC
  allow.arbitrumOne.compound_v3.cUSDCv3.withdraw(USDC),
] satisfies PermissionList
