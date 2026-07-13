import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDT, morpho } from "@/addresses/eth"
import { PermissionList } from "@/types"

export default () =>
  [
    // Aave v3 Core Market - Withdraw USDC to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
    // Aave v3 Core Market - Withdraw USDT to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(USDT, undefined, c.avatar),

    // Morpho Vault - kpk USDC Prime v2 - Withdraw USDC to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcPrimeV2,
    },
    // Morpho Vault - kpk USDC Yield v2 - Withdraw USDC to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldV2,
    },
    // Morpho Vault - kpk USDT Prime v2 - Withdraw USDT to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdtPrimeV2,
    },

    // Spark - Withdraw USDS from sUSDS to the avatar Safe
    allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
  ] satisfies PermissionList
