import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho, USDC, USDT } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Withdraw USDC/USDT to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(
      c.or(USDC, USDT),
      undefined,
      c.avatar
    ),

    // Aave v3 - sGHO (Savings GHO) - Withdraw to the avatar Safe
    allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),

    // Morpho Vault - kpk USDC Prime v2 - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcPrimeV2,
    },

    // Morpho Vault - kpk USDC Yield v2 - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldV2,
    },

    // Morpho Vault - kpk USDT Prime v2 - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdtPrimeV2,
    },

    // Sky - sUSDS - Withdraw to the avatar Safe
    allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
  ] satisfies PermissionList
