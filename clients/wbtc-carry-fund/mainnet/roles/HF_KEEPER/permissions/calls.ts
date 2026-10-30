import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { compoundV3, frxUSD, morpho, USDC, USDG } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve as reserve } from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const curveUsdgUsdcPool = contracts.mainnet.curve.usdgUsdcPool

export default (parameters: Parameters) =>
  [
    // Aave v4 Bluechip Spoke - Borrow USDC through the Prime and Core Hub credit lines
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      reserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      reserve.usdcCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Repay USDC. The Spoke pulls the asset from the caller,
    // hence the approval.
    allowErc20Approve([USDC], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdcCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Borrow/repay USDG through the Core Hub line (reserve 11):
    // the cheaper, deeper debt route (3.9% on 9 Oct 2026 vs USDC above its kink). The
    // borrowed USDG is swapped to USDC on CowSwap (_actions.ts) before it goes into the
    // vaults, and USDC is swapped back to USDG to repay.
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),
    allowErc20Approve([USDG], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Repay frxUSD debt (Core Hub line, reserve 8). MANAGER can
    // borrow frxUSD, so the HF manager must be able to repay it to deleverage. Repay only:
    // the HF manager does not open a frxUSD borrow.
    allowErc20Approve([frxUSD], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.frxusdCore,
      undefined,
      c.avatar
    ),

    // Compound v3 - Institutional Market (ciUSDCv3) - Borrow/repay USDC for the avatar: the
    // debt leg of the HF manager when the fund borrows on Comet. withdraw(USDC) borrows and
    // supply(USDC) repays, both for msg.sender (the avatar). No collateral asset is scoped. The
    // Comet pulls the asset from the caller, hence the approval.
    allowErc20Approve([USDC], [compoundV3.ciUSDCv3]),
    {
      ...allow.mainnet.compoundV3.comet.supply(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },

    // Curve - USDG/USDC StableSwap-NG pool (coins(0) USDG, coins(1) USDC): atomic swap both
    // ways, for a same-transaction repay of the USDG debt. The 4-argument `exchange` pays
    // msg.sender (the avatar); the 5-argument variant with a receiver stays closed. Roles
    // cannot bound `min_dy`, the caller sets it.
    allowErc20Approve([USDC, USDG], [curveUsdgUsdcPool]),
    allow.mainnet.curve.usdgUsdcPool["exchange(int128,int128,uint256,uint256)"](
      0,
      1
    ),
    allow.mainnet.curve.usdgUsdcPool["exchange(int128,int128,uint256,uint256)"](
      1,
      0
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

    // Morpho Vault - kpk USDC Yield v2 / kpk USDC Yield RWA - Force deallocate (unlock
    // liquidity across the vault's underlying markets before a withdrawal) - onBehalf
    // pinned to the avatar Safe
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
  ] satisfies PermissionList
