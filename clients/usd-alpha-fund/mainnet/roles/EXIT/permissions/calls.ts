import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { USDC, USDT, compoundV3, morpho, symbiotic } from "@/addresses/eth"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve, aaveV4MainReserve } from "../../../addresses"
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

    // Aave v4 - Withdraw USDC from the two pinned supply reserves (Bluechip Spoke reserve 4,
    // Prime Hub; Main Spoke reserve 7, Core Hub), onBehalfOf pinned to the avatar. Withdraw
    // pays the caller (the avatar).
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      aaveV4BluechipReserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mainSpoke.withdraw(
      aaveV4MainReserve.usdcCore,
      undefined,
      c.avatar
    ),

    // Compound v3 - Institutional Market (ciUSDCv3) - Withdraw USDC
    {
      ...allow.mainnet.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },

    // Morpho Vault - kpk USDC Prime v2 - Withdraw/redeem to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcPrimeV2,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcPrimeV2,
    },

    // Morpho Vault - kpk USDC Yield RWA - Withdraw/redeem to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },

    // Morpho Vault - kpk USDC Yield v2 - Withdraw/redeem to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldV2,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldV2,
    },

    // Morpho Vault - kpk USDC Yield RWA / kpk USDC Yield v2 / kpk YO Ecosystem - Force deallocate
    // (unlock liquidity across the vault's underlying markets before a withdrawal) - onBehalf
    // pinned to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkUsdcYieldV2,
    },
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkYoEcosystem,
    },

    // Morpho Vault - kpk USDT Prime v2 - Withdraw/redeem to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdtPrimeV2,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdtPrimeV2,
    },

    // Morpho Vault - kpk YO Ecosystem - Withdraw/redeem to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },

    // Sky - sUSDS - Withdraw to the avatar Safe
    allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),

    // Symbiotic - KPK USDC LiquidLane (RWA Liquidity) - Withdraw/redeem to the avatar Safe,
    // scoped via the generic Morpho vault ABI + a targetAddress override (same selectors)
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
  ] satisfies PermissionList
