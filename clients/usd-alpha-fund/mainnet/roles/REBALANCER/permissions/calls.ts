import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { GHO, USDC, morpho } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default () =>
  [
    /*********************************************
     * Protocols
     *********************************************/

    // Aave v3 - sGHO (Savings GHO)
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.sGho]),
    allow.mainnet.aaveV3.sGho.deposit(undefined, c.avatar),
    allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.aaveV3.sGho.redeem(undefined, c.avatar, c.avatar),

    // Morpho Vault - kpk USDC Yield RWA
    allowErc20Approve([USDC], [morpho.kpkUsdcYieldRWA]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
  ] satisfies PermissionList
