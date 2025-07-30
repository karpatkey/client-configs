import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC } from "@/addresses/eth"
import { PermissionList } from "@/types"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - SKY_USDS
  allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sUsds.redeem(undefined, c.avatar, c.avatar),
] satisfies PermissionList
