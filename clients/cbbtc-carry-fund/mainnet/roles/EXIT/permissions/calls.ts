import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { cbBTC, frxUSD, morpho, syrupUSDG, USDC, USDG } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import {
  aaveV4BluechipReserve as reserve,
  aaveV4MapleReserve as mapleReserve,
} from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const curveUsdgUsdcPool = contracts.mainnet.curve.usdgUsdcPool
const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Repay USDC debt for the avatar (onBehalfOf pinned). The Pool pulls
    // the asset from the caller, hence the approval.
    allowErc20Approve([USDC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.repay(USDC, undefined, undefined, c.avatar),

    // Aave v3 Core Market - Withdraw cbBTC collateral to the avatar Safe: a full
    // loan_position_exit releases the BTC collateral once the USDC debt is repaid
    allow.mainnet.aaveV3.poolCoreV3.withdraw(cbBTC, undefined, c.avatar),

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

    // Aave v4 Bluechip Spoke - Withdraw cbBTC collateral (reserve 2) to the avatar Safe
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.cbbtcPrime,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Repay USDG debt (Core Hub line, reserve 11): the same exit
    // for the USDG debt route.
    allowErc20Approve([USDG], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.usdgCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Repay frxUSD debt (Core Hub line, reserve 8): MANAGER can
    // borrow frxUSD, so a full exit must be able to repay it before the cbBTC is withdrawn.
    allowErc20Approve([frxUSD], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.repay(
      reserve.frxusdCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Maple Spoke - syrupUSDG loop unwind: repay USDG (reserves 0 and 3) and withdraw
    // the syrupUSDG collateral (reserve 1) to the avatar Safe
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

    // Maple - syrupUSDG: queue the withdrawn collateral for redemption and collect it. Owner
    // and receiver pinned to the avatar.
    {
      ...allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),
      targetAddress: syrupUSDG,
    },
    {
      ...allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
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
