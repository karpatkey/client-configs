import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { maple, morpho, USDC, USDT } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
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

    // Maple - mint syrupUSDT when levering leg 2, redeem it when delevering. No
    // authorizeAndDeposit here: the one-time onboarding belongs to MANAGER, and once the
    // lender bitmap is set it is shared by every caller acting as the avatar Safe.
    allowErc20Approve([USDT], [maple.syrupUsdtRouter]),
    allow.mainnet.maple.syrupRouter.deposit(),
    allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
  ] satisfies PermissionList
