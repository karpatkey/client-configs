import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { GHO, USDC, morpho, symbiotic } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve, aaveV4MainReserve } from "../../../addresses"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const mainSpoke = contracts.mainnet.aaveV4.mainSpoke

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

    // Aave v4 - USDC supply / withdraw on the two pinned reserves the MANAGER role also scopes:
    // Bluechip Spoke reserve 4 (Prime Hub) and Main Spoke reserve 7 (Core Hub), onBehalfOf
    // pinned to the avatar. No borrow, no collateral toggle.
    allowErc20Approve([USDC], [bluechipSpoke, mainSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      aaveV4BluechipReserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      aaveV4BluechipReserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mainSpoke.supply(
      aaveV4MainReserve.usdcCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mainSpoke.withdraw(
      aaveV4MainReserve.usdcCore,
      undefined,
      c.avatar
    ),

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

    // Morpho Vault - kpk YO Ecosystem
    allowErc20Approve([USDC], [morpho.kpkYoEcosystem]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },

    // Symbiotic - KPK USDC LiquidLane (RWA Liquidity) - ERC-4626 vault, scoped via the generic
    // Morpho vault ABI + a targetAddress override (same deposit / withdraw / redeem selectors)
    allowErc20Approve([USDC], [symbiotic.kpkUsdcLiquidLane]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
  ] satisfies PermissionList
