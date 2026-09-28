import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { maple, morpho, syrupUSDT, USDC, USDT, XAUt } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Withdraw XAUt to the avatar Safe
    allow.mainnet.aaveV3.poolCoreV3.withdraw(XAUt, undefined, c.avatar),

    // Aave v3 Core Market - Repay USDC
    allowErc20Approve([USDC], [contracts.mainnet.aaveV3.poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.repay(USDC, undefined, undefined, c.avatar),

    // Morpho Vault - kpk USDC Yield v2 - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldV2,
    },

    // Morpho Vault - kpk USDC Yield RWA - Withdraw to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
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

    // Morpho Blue - unwind the leveraged loop. Only the deleveraging half is scoped here:
    // repay debt and pull collateral back to the avatar Safe. No borrow, no
    // supplyCollateral - this role can shrink a position but never open or grow one.
    allowErc20Approve([USDT], [contracts.mainnet.morpho.morphoBlue]),

    // Leg 1 - USDT/XAUt, LLTV 77%
    allow.mainnet.morpho.morphoBlue.repay(
      {
        loanToken: USDT,
        collateralToken: XAUt,
        oracle: morpho.oracleXautUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "770000000000000000",
      },
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.morpho.morphoBlue.withdrawCollateral(
      {
        loanToken: USDT,
        collateralToken: XAUt,
        oracle: morpho.oracleXautUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "770000000000000000",
      },
      undefined,
      c.avatar,
      c.avatar
    ),

    // Leg 2 - USDT/syrupUSDT, LLTV 91.5%
    allow.mainnet.morpho.morphoBlue.repay(
      {
        loanToken: USDT,
        collateralToken: syrupUSDT,
        oracle: morpho.oraclesyrupUsdtUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.morpho.morphoBlue.withdrawCollateral(
      {
        loanToken: USDT,
        collateralToken: syrupUSDT,
        oracle: morpho.oraclesyrupUsdtUsdt,
        irm: morpho.adaptativeCurveIrm,
        lltv: "915000000000000000",
      },
      undefined,
      c.avatar,
      c.avatar
    ),

    // Maple - redeem syrupUSDT back to USDT through the queue withdrawal manager.
    // No deposit permission here: this role only unwinds.
    allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
  ] satisfies PermissionList
