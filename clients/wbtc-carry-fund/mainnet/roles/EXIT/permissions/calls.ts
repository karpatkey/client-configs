import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho, syrupUSDG, USDC, USDG } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import {
  aaveV4BluechipReserve as reserve,
  aaveV4MapleReserve as mapleReserve,
} from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke

export default (parameters: Parameters) =>
  [
    // Aave v4 Bluechip Spoke - Repay USDC debt on both credit lines. The Spoke pulls
    // the asset from the caller, hence the approval.
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

    // Aave v4 Bluechip Spoke - Withdraw WBTC collateral to the avatar Safe
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Repay USDG debt (Core Hub line, reserve 11) and withdraw cbBTC
    // collateral (reserve 2): the same exit for the USDG debt route and the second BTC.
    allowErc20Approve([USDG], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.cbbtcPrime,
      undefined,
      c.avatar
    ),

    // syrupUSDG loop unwind - repay USDG on the Maple Spoke (reserves 0 and 3), withdraw the
    // syrupUSDG collateral (reserve 1), and queue it for redemption at Maple. Owner and
    // receiver pinned to the avatar.
    allowErc20Approve([USDG], [mapleSpoke]),
    allow.mainnet.aaveV4.mapleSpoke.repay(
      mapleReserve.usdgGlobalDollar,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mapleSpoke.repay(
      mapleReserve.usdgCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mapleSpoke.withdraw(
      mapleReserve.syrupUsdg,
      undefined,
      c.avatar
    ),
    {
      ...allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
      targetAddress: syrupUSDG,
    },
    {
      ...allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),
      targetAddress: syrupUSDG,
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

    // Morpho Vault - kpk USDC Yield RWA - Withdraw/redeem to the avatar Safe
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
