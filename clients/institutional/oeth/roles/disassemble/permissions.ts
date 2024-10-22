import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "../../../../../types"

export default [
  // Aave v3 - Withdraw DAI
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0000", // DAI assetId: 0
    })
  ),
  // Aave v3 - Withdraw USDC
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x000d", // USDC assetId: 13
    })
  ),
  // Aave v3 - Withdraw USDC.e
  allow.optimism.aave_v3.pool_v3["withdraw(bytes32)"](
    // skip amount 30 bytes
    // assetId: 4 bytes
    c.bitmask({
      shift: 30,
      mask: "0xffff",
      value: "0x0002", // USDC.e assetId: 2
    })
  ),
] satisfies PermissionList