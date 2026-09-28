import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { maple, morpho, syrupUSDT, USDC, USDT } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Set eMode to category 43 (XAUt collateral / USDC, USDT, GHO borrowable)
    allow.mainnet.aaveV3.poolCoreV3.setUserEMode(43),

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

    // Morpho Vault - kpk USDC Yield v2 / kpk USDC Yield RWA - Force deallocate (unlock liquidity across the
    // vault's underlying markets before a withdrawal) - onBehalf pinned to the avatar Safe
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

    // Maple - mint syrupUSDT for the Morpho leg 2 collateral, through the SyrupRouter.
    allowErc20Approve([USDT], [maple.syrupUsdtRouter]),

    // One-time onboarding. The avatar Safe has no usable owner - its only owner is a
    // contract whose fallback always reverts - so every call must go through Roles,
    // including this one. Maple's partner API returns the (v,r,s) that authorizes THIS
    // Safe; the router then calls setLenderBitmaps([msg.sender], [bitmap]) and deposits
    // in the same transaction. Nothing is pinned here on purpose: the arguments are only
    // valid as a tuple signed by a Maple permission admin over
    // (router, msg.sender, nonce, bitmap, deadline), so an arbitrary bitmap is not
    // reachable without Maple signing it, while pinning it would break the call if Maple
    // ever issues a bitmap other than 16. Safe to revoke once the bitmap is set.
    allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),

    // Ongoing deposits once the lender bitmap is set. deposit() takes no receiver: the
    // router mints to itself and forwards the shares to msg.sender by construction, so
    // there is nothing to pin. The bytes32 is an off-chain tag.
    allow.mainnet.maple.syrupRouter.deposit(),

    // Maple - exit through the queue withdrawal manager. requestRedeem enqueues the
    // shares, removeShares cancels a pending request. Owner pinned to the avatar Safe.
    allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
  ] satisfies PermissionList
