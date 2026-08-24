import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { cbBTC, morpho, USDC, USDT, WBTC, WETH, wstETH } from "@/addresses/eth"
import { contracts } from "@/contracts"
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

    // Compound v3 - Institutional Market - Withdraw USDC, WETH, wstETH, cbBTC, WBTC
    {
      ...allow.mainnet.compoundV3.comet.withdraw(
        c.or(USDC, WETH, wstETH, cbBTC, WBTC)
      ),
      targetAddress: contracts.mainnet.compoundV3.cUsdcInstitutionalV3,
    },

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
