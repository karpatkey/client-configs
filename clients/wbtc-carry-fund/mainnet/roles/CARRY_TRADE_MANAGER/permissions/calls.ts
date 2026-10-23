import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { compoundV3, morpho, USDC, USDG, WBTC } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve as reserve } from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const curveUsdgUsdcPool = contracts.mainnet.curve.usdgUsdcPool

// The kpk-agents carry-trade manager for this fund, on its own signer: WBTC collateral on the
// Bluechip Spoke (reserve 1, Prime Hub), debt on the Core Hub USDC (7) and USDG (11) lines, the
// borrowed stablecoin deployed into the two kpk USDC vaults. Only the calls the manager signs:
// no other reserve, no cbBTC, no stablecoin supply, nothing on behalf of or to a third party.
// The same legs exist on the Aave v3 Core pool (WBTC collateral, USDC debt) for `venue_kind:
// aave_v3`, and on the Compound v3 Institutional Market (ciUSDCv3, same assets).
export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market (venue_kind: aave_v3) - WBTC collateral: supply for the avatar, enable
    // as collateral (only ever `true`), withdraw to the avatar. The Pool pulls WBTC on supply,
    // hence the approval. Hand-scoped rather than defi-kit's aave_v3.deposit, which would also
    // let the role disable WBTC as collateral and claim rewards.
    allowErc20Approve([WBTC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(WBTC, true),
    allow.mainnet.aaveV3.poolCoreV3.supply(WBTC, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(WBTC, undefined, c.avatar),

    // Compound v3 - Institutional Market (ciUSDCv3) - the Aave v3 Core legs on Comet: WBTC
    // collateral, USDC debt. supply / withdraw(asset, amount) always act for msg.sender, the
    // avatar: supply WBTC adds collateral and supply USDC repays; withdraw WBTC removes
    // collateral and withdraw USDC borrows. USDC supplied past the debt stays a USDC supply
    // position of the avatar. The Comet pulls the asset from the caller, hence the approvals.
    // No cbBTC, no To / From variants, allow / allowBySig, transfers or buyCollateral. Same
    // hand-scoping as MANAGER.
    allowErc20Approve([USDC, WBTC], [compoundV3.ciUSDCv3]),
    {
      ...allow.mainnet.compoundV3.comet.supply(c.or(USDC, WBTC)),
      targetAddress: compoundV3.ciUSDCv3,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(c.or(USDC, WBTC)),
      targetAddress: compoundV3.ciUSDCv3,
    },

    // Aave v4 Bluechip Spoke - The Spoke pulls the asset on supply (WBTC) and on repay (USDC,
    // USDG), hence the approvals.
    allowErc20Approve([USDC, USDG, WBTC], [bluechipSpoke]),

    // Aave v4 Bluechip Spoke - WBTC collateral (reserve 1): supply, enable as collateral (only
    // ever `true`), withdraw for a redemption or the unwind
    allow.mainnet.aaveV4.bluechipSpoke.setUsingAsCollateral(
      reserve.wbtcPrime,
      true,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Borrow / repay the USDC (7) and USDG (11) Core Hub lines
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      reserve.usdcCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdcCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),

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
