import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  cbBTC,
  maple,
  morpho,
  syrupUSDG,
  syrupUSDT,
  USDC,
  USDG,
  USDT,
  WBTC,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import {
  aaveV4BluechipReserve as reserve,
  aaveV4MapleReserve as mapleReserve,
  morphoSyrupUsdtUsdtMarket,
} from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke
const morphoBlue = contracts.mainnet.morpho.morphoBlue

export default (parameters: Parameters) =>
  [
    // Aave v4 Bluechip Spoke - Supply/withdraw WBTC collateral (Prime Hub).
    // The Spoke pulls the asset from the caller, hence the approval.
    allowErc20Approve([WBTC], [bluechipSpoke]),
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
    // `supply` does not enable the reserve as collateral, it has to be set explicitly
    allow.mainnet.aaveV4.bluechipSpoke.setUsingAsCollateral(
      reserve.wbtcPrime,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Supply/withdraw cbBTC as a second BTC collateral (Prime
    // Hub, reserve id 2), same shape as WBTC. The Spoke pulls the asset from the caller,
    // hence the approval.
    allowErc20Approve([cbBTC], [bluechipSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      reserve.cbbtcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      reserve.cbbtcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.setUsingAsCollateral(
      reserve.cbbtcPrime,
      undefined,
      c.avatar
    ),

    // Shares contract - Redemptions are paid out by the shares contract pulling the asset from
    // the avatar Safe (safeTransferFrom(avatar, receiver)), so it needs an allowance on
    // every asset the fund may settle in. The WBTC allowance was set at deploy outside
    // this role; cbBTC has none. Both are scoped so the allowance can be topped up or
    // reset to 0 through the role.
    allowErc20Approve([WBTC, cbBTC], [parameters.shares]),

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

    // Merkl - Claim USDC incentives accrued by the kpk USDC Yield RWA vault position and
    // the Aave v4 Prime Hub USDC borrow campaign. `users` is pinned to the avatar Safe so
    // the role can never claim to a third party; `tokens`/`amounts`/`proofs` stay open
    // because the merkle proof binds them. One `c.or` branch per array length: arity ==
    // number of reward tokens settled in a single claim (2 live today: USDC and the Merkl
    // USDC wrapper 0x4045FcF533C84578e754be939821d26A087FC7C9, which unwraps on transfer).
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

    // ---------------------------------------------------------------------------------
    // syrupUSDG loop on Aave v4: USDG borrowed against BTC on the Bluechip Spoke seeds
    // syrupUSDG (Maple), which is supplied as collateral on the Maple SyrupUSDG Spoke to
    // borrow more USDG, and so on.
    // ---------------------------------------------------------------------------------

    // Aave v4 Bluechip Spoke - Borrow/repay USDG through the Core Hub credit line
    // (reserve 11). The Spoke pulls the asset on repay, hence the approval.
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

    // Maple - Mint syrupUSDG through its SyrupRouter. The pool is permissioned at
    // function level by the PoolPermissionManager
    // (0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3): `deposit` needs lender bitmap 16,
    // and the avatar's bitmap is 0. The router pulls USDG from the caller, hence the
    // approval.
    allowErc20Approve([USDG], [maple.syrupUsdgRouter]),
    // One-time onboarding. The avatar Safe's only owner is a contract whose fallback
    // always reverts, so it can only act through Roles. Maple signs
    // (router, msg.sender, nonce, bitmap, deadline) for THIS Safe; the router sets the
    // lender bitmap and deposits in the same call. Arguments are left open on purpose:
    // they are only valid as a tuple signed by a Maple permission admin. Can be revoked
    // once the bitmap is set.
    {
      ...allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
      targetAddress: maple.syrupUsdgRouter,
    },
    // Ongoing deposits once the bitmap is set. No receiver parameter: the router mints
    // to itself and forwards the shares to msg.sender. The bytes32 is an offchain tag.
    {
      ...allow.mainnet.maple.syrupRouter.deposit(),
      targetAddress: maple.syrupUsdgRouter,
    },

    // Maple - Exit syrupUSDG through the queue withdrawal manager. requestRedeem
    // enqueues shares (paid out in USDG to the owner when processed), removeShares
    // cancels a pending request, redeem collects a processed request if the Safe is ever
    // switched to manual withdrawals. Owner and receiver pinned to the avatar. `withdraw`
    // and `requestWithdraw` are not scoped: the PoolManager reverts them
    // (PM:PW:NOT_ENABLED / PM:RW:NOT_ENABLED).
    {
      ...allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
      targetAddress: syrupUSDG,
    },
    {
      ...allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
      targetAddress: syrupUSDG,
    },
    {
      ...allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),
      targetAddress: syrupUSDG,
    },

    // Aave v4 Maple SyrupUSDG Spoke - Supply/withdraw syrupUSDG collateral (reserve 1,
    // Global Dollar Hub). The Spoke pulls the asset from the caller, hence the approval.
    allowErc20Approve([syrupUSDG], [mapleSpoke]),
    allow.mainnet.aaveV4.mapleSpoke.supply(
      mapleReserve.syrupUsdg,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mapleSpoke.withdraw(
      mapleReserve.syrupUsdg,
      undefined,
      c.avatar
    ),
    // `supply` does not enable the reserve as collateral, it has to be set explicitly
    allow.mainnet.aaveV4.mapleSpoke.setUsingAsCollateral(
      mapleReserve.syrupUsdg,
      undefined,
      c.avatar
    ),

    // Aave v4 Maple SyrupUSDG Spoke - Borrow USDG through the Global Dollar Hub
    // (reserve 0) and Core Hub (reserve 3) credit lines
    allow.mainnet.aaveV4.mapleSpoke.borrow(
      mapleReserve.usdgGlobalDollar,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mapleSpoke.borrow(
      mapleReserve.usdgCore,
      undefined,
      c.avatar
    ),

    // Aave v4 Maple SyrupUSDG Spoke - Repay USDG. The Spoke pulls the asset from the
    // caller, hence the approval.
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
    // ---------------------------------------------------------------------------------
    // syrupUSDT loop on Morpho Blue: USDT (swapped from the USDC borrowed on Aave v4)
    // mints syrupUSDT (Maple), which is supplied as collateral on the syrupUSDT/USDT
    // market (LLTV 91.5%) to borrow more USDT, and so on. Mirrors the XAUt fund's leg 2
    // in #263.
    // ---------------------------------------------------------------------------------

    // Maple - Mint syrupUSDT through its SyrupRouter. Same permissioning as syrupUSDG
    // above: lender bitmap 16 needed for `deposit`, avatar's bitmap is 0, hence
    // `authorizeAndDeposit` for the one-time Maple-signed onboarding (arguments open on
    // purpose, see above). The router pulls USDT from the caller, hence the approval.
    // USDT only accepts a new non-zero allowance from 0; `allowErc20Approve` leaves the
    // amount open, so resetting to 0 is allowed.
    allowErc20Approve([USDT], [maple.syrupUsdtRouter]),
    allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
    allow.mainnet.maple.syrupRouter.deposit(),

    // Maple - Exit syrupUSDT through the queue withdrawal manager: request, cancel, or
    // collect a processed request in manual mode. Owner and receiver pinned to the avatar.
    allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),

    // Morpho Blue - syrupUSDT/USDT market only (full MarketParams pinned). Supply and
    // withdraw syrupUSDT collateral, borrow and repay USDT; onBehalf and receiver pinned
    // to the avatar, callback data pinned to empty. Morpho pulls both tokens from the
    // caller, hence the approvals.
    allowErc20Approve([syrupUSDT, USDT], [morphoBlue]),
    allow.mainnet.morpho.morphoBlue.supplyCollateral(
      morphoSyrupUsdtUsdtMarket,
      undefined,
      c.avatar,
      "0x"
    ),
    allow.mainnet.morpho.morphoBlue.withdrawCollateral(
      morphoSyrupUsdtUsdtMarket,
      undefined,
      c.avatar,
      c.avatar
    ),
    allow.mainnet.morpho.morphoBlue.borrow(
      morphoSyrupUsdtUsdtMarket,
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),
    allow.mainnet.morpho.morphoBlue.repay(
      morphoSyrupUsdtUsdtMarket,
      undefined,
      undefined,
      c.avatar,
      "0x"
    ),
  ] satisfies PermissionList
