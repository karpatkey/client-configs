import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho } from "@/addresses/eth"
import { PermissionList } from "@/types"

export default () =>
  [
    // Morpho Vault - kpk USDC Prime v2 - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcPrimeV2,
    },

    // Morpho Vault - kpk USDC Yield RWA - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
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

    // Morpho Vault - kpk YO Ecosystem - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
  ] satisfies PermissionList
