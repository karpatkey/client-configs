import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, kpk, morpho } from "@/addresses/eth"
import { PermissionList } from "@/types"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // kpk - USD Prime Fund
  {
    ...allow.mainnet.kpk.shares.requestRedeem(
      undefined,
      undefined,
      c.avatar
    ),
    targetAddress: kpk.usdPrimeFundShares,
  },
  // kpk - Renaissance Fund
  {
    ...allow.mainnet.kpk.shares.requestRedeem(
      undefined,
      undefined,
      c.avatar
    ),
    targetAddress: kpk.renaissanceFundShares,
  },

  // Morpho - kpk EURC Vault
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurc,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurc,
  },
  // Morpho - kpk USDC Prime Vault
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdc,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdc,
  },

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - SKY_USDS
  allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sUsds.redeem(undefined, c.avatar, c.avatar),
] satisfies PermissionList
