import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { compoundV3, morpho, USDC, XAUt } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// The kpk-agents carry-trade manager for this fund, on its own signer (replaces the HF
// keeper): XAUt collateral on Aave v3 Core, USDC debt, the borrowed USDC deployed into the
// USDC menu (kpk USDC Yield v2 / Yield RWA / Prime v2, YO Ecosystem Vault, Aave v3 Core USDC
// supply, Compound v3 ciUSDCv3 USDC supply). Only the calls the manager signs: no eMode switch
// (the MANAGER sets category 43), no yoUSD Edge (async exit), no swaps, nothing on behalf of
// or to a third party.
export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - XAUt collateral: supply for the avatar, enable as collateral (only
    // ever `true`), withdraw to the avatar. The Pool pulls XAUt on supply, hence the approval.
    // Hand-scoped rather than defi-kit's aave_v3.deposit, which would also let the role
    // disable XAUt as collateral and claim rewards.
    allowErc20Approve([XAUt], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(XAUt, true),
    allow.mainnet.aaveV3.poolCoreV3.supply(XAUt, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(XAUt, undefined, c.avatar),

    // Aave v3 Core Market - USDC supply as a yield venue (`aave_v3_supply` position kind), for
    // the avatar. The Pool pulls USDC on supply and on repay, hence the approval.
    allowErc20Approve([USDC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.supply(USDC, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),

    // Compound v3 - Institutional Market (ciUSDCv3) - USDC supply as a yield venue. supply /
    // withdraw(asset, amount) always act for msg.sender, the avatar. No collateral leg (XAUt is
    // not a Comet collateral), no To / From variants, allow / allowBySig, transfers or
    // buyCollateral. Same hand-scoping as MANAGER. Selectable by the manager only once
    // kpk-agents has a Comet yield position kind.
    allowErc20Approve([USDC], [compoundV3.ciUSDCv3]),
    {
      ...allow.mainnet.compoundV3.comet.supply(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },

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

    // Morpho Vault - kpk USDC Yield v2 / kpk USDC Yield RWA / kpk USDC Prime v2 / YO
    // Ecosystem Vault - Force deallocate (unlock liquidity across the vault's underlying
    // markets before a withdrawal) - onBehalf pinned to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkUsdcPrimeV2,
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
      targetAddress: morpho.kpkUsdcYieldRWA,
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
  ] satisfies PermissionList
