import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { compoundV3, morpho, USDC, XAUt, yo } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Set eMode to category 43 only (XAUt collateral / USDC, USDT, GHO
    // borrowable; LTV 70%, LT 75%). Only the MANAGER can switch eMode: no Sub role gets it.
    allow.mainnet.aaveV3.poolCoreV3.setUserEMode(43),

    // Compound v3 - Institutional Market (ciUSDCv3) - USDC supply as a yield venue. Comet's
    // supply / withdraw(asset, amount) always act for msg.sender, the avatar. No collateral
    // leg (XAUt is not a Comet collateral; the cbBTC, WBTC, WETH and wstETH legs are not
    // scoped), so `withdraw(USDC)` can only pull supplied USDC. Not scoped: supplyTo /
    // supplyFrom / withdrawTo / withdrawFrom, allow / allowBySig, transfers, buyCollateral,
    // absorb. Hand-scoped: defi-kit's compound_v3 resolves USDC to the main cUSDCv3 market.
    allowErc20Approve([USDC], [compoundV3.ciUSDCv3]),
    {
      ...allow.mainnet.compoundV3.comet.supply(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },

    // Merkl - Claim incentives accrued by the avatar (kpk USDC Yield RWA position and other
    // USDC venues). `users` is pinned to the avatar Safe so the role can never claim to a
    // third party; `tokens`/`amounts`/`proofs` stay open because the merkle proof binds them.
    // One `c.or` branch per array length: arity == number of reward tokens settled in a
    // single claim.
    allow.mainnet.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
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

    // Shares contract - Redemptions are paid out by the shares contract pulling the asset from
    // the avatar Safe (safeTransferFrom(avatar, receiver)), so it needs an allowance on the
    // fund's settlement asset: XAUt only. The allowance was set at deploy outside this role.
    // Scoped so it can be topped up or reset to 0 through the role.
    allowErc20Approve([XAUt], [parameters.shares]),

    // yoUSD Edge (YO Protocol, USDC) - oracle-priced ERC-4626 with an async exit. Deposit is
    // synchronous; `requestRedeem` and `redeem` (an alias of it) pay at once when the vault has
    // idle USDC, otherwise they escrow the shares until YO fulfils and pushes the USDC to
    // `receiver`: there is no claim call to scope, so pinning receiver and owner to the avatar
    // is the control. Not scoped: `mint`, `withdraw` (always reverts), `cancelRedeem` and
    // `fulfillRedeem` (YO only), share `transfer` / `approve`. Hand-scoped, defi-kit has no
    // action for this vault. Same scope as the cbBTC fund (#289).
    allowErc20Approve([USDC], [yo.usdEdge]),
    allow.mainnet.yo.edgeVault.deposit(undefined, c.avatar),
    allow.mainnet.yo.edgeVault.requestRedeem(undefined, c.avatar, c.avatar),
    allow.mainnet.yo.edgeVault.redeem(undefined, c.avatar, c.avatar),
  ] satisfies PermissionList
