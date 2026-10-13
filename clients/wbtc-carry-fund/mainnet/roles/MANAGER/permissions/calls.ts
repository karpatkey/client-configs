import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  cbBTC,
  cirBTC,
  frxUSD,
  maple,
  morpho,
  syrupUSDC,
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
} from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const curveUsdgUsdcPool = contracts.mainnet.curve.usdgUsdcPool
const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// ---------------------------------------------------------------------------------------
// Aave v4 - two Spokes, every reserve pinned by id (addresses.ts), for the avatar only.
//
// BTC is collateral only: no BTC reserve can be borrowed, and no stablecoin reserve can be
// supplied. A reserve listed later is not reachable. What stays closed: acting for anyone
// but the avatar (onBehalfOf pinned), every other Spoke, position managers
// (setUserPositionManager, the WithSig variant, renouncePositionManagerRole), multicall,
// permitReserve, liquidationCall and every admin function. Aave v4 is not in defi-kit, hence
// hand-scoped here.
// ---------------------------------------------------------------------------------------

// Bluechip Spoke - WBTC (1) and cbBTC (2), Prime Hub
const bluechipCollateral = c.or(reserve.wbtcPrime, reserve.cbbtcPrime)
// Bluechip Spoke - the stablecoin credit lines: USDC Prime (4), USDC Core (7), frxUSD Core (8)
// and USDG Core (11)
const bluechipDebt = c.or(
  reserve.usdcPrime,
  reserve.usdcCore,
  reserve.frxusdCore,
  reserve.usdgCore
)
// Maple Spoke - USDG on the Global Dollar Hub (0) and the Core Hub (3)
const mapleDebt = c.or(mapleReserve.usdgGlobalDollar, mapleReserve.usdgCore)

// Maple - one syrup pool and its SyrupRouter. The pools are permissioned at function level by
// the PoolPermissionManager (0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3): `deposit` needs
// lender bitmap 16, and the avatar's bitmap is 0. `authorizeAndDeposit` covers the one-time
// Maple-signed onboarding: Maple signs (router, msg.sender, nonce, bitmap, deadline) for THIS
// Safe, so its arguments are left open on purpose. The router pulls the asset from the
// caller, hence the approval. Exits go through the pool's queue: requestRedeem enqueues
// shares, removeShares cancels, redeem collects a processed request in manual mode. Owner and
// receiver pinned to the avatar. `withdraw` and `requestWithdraw` are not scoped: the
// PoolManager reverts them. USDT only accepts a new non-zero allowance from 0;
// `allowErc20Approve` leaves the amount open, so resetting to 0 is allowed.
const maplePool = (
  asset: `0x${string}`,
  router: `0x${string}`,
  pool: `0x${string}`
) => [
  allowErc20Approve([asset], [router]),
  {
    ...allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
    targetAddress: router,
  },
  { ...allow.mainnet.maple.syrupRouter.deposit(), targetAddress: router },
  {
    ...allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),
    targetAddress: pool,
  },
  {
    ...allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
    targetAddress: pool,
  },
  {
    ...allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    targetAddress: pool,
  },
]

export default (parameters: Parameters) =>
  [
    // Aave v3 Core - backup borrow venue and the syrupUSDT loop (e-mode 33). Supply,
    // withdraw, collateral and borrow / repay come from defi-kit in _actions.ts. Added here:
    // cirBTC, which defi-kit does not list yet (Aave v3 keys reserves by token address, so
    // this works from the day it is listed), and e-mode switching.
    allowErc20Approve([cirBTC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.setUserEMode(),
    allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(cirBTC),
    allow.mainnet.aaveV3.poolCoreV3.supply(cirBTC, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(cirBTC, undefined, c.avatar),

    // Aave v4 Bluechip Spoke - The Spoke pulls the asset on supply (cbBTC, WBTC) and on repay
    // (frxUSD, USDC, USDG), hence the approvals.
    allowErc20Approve([cbBTC, frxUSD, USDC, USDG, WBTC], [bluechipSpoke]),

    // Aave v4 Bluechip Spoke - WBTC and cbBTC as collateral only. `supply` does not enable a
    // reserve as collateral, it has to be set explicitly.
    allow.mainnet.aaveV4.bluechipSpoke.setUsingAsCollateral(
      bluechipCollateral,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      bluechipCollateral,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      bluechipCollateral,
      undefined,
      c.avatar
    ),

    // Aave v4 Bluechip Spoke - Borrow / repay the stablecoin credit lines only
    allow.mainnet.aaveV4.bluechipSpoke.borrow(
      bluechipDebt,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.repay(bluechipDebt, undefined, c.avatar),

    // Aave v4 Maple Spoke - the syrupUSDG loop: syrupUSDG (reserve 1) as collateral, USDG
    // borrowed on the Global Dollar and Core Hub lines
    allowErc20Approve([syrupUSDG, USDG], [mapleSpoke]),
    allow.mainnet.aaveV4.mapleSpoke.setUsingAsCollateral(
      mapleReserve.syrupUsdg,
      undefined,
      c.avatar
    ),
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
    allow.mainnet.aaveV4.mapleSpoke.borrow(mapleDebt, undefined, c.avatar),
    allow.mainnet.aaveV4.mapleSpoke.repay(mapleDebt, undefined, c.avatar),

    // Aave v4 - Refresh the avatar's own dynamic config / risk premium after collateral
    // changes, on both Spokes
    allow.mainnet.aaveV4.bluechipSpoke.updateUserDynamicConfig(c.avatar),
    allow.mainnet.aaveV4.bluechipSpoke.updateUserRiskPremium(c.avatar),
    allow.mainnet.aaveV4.mapleSpoke.updateUserDynamicConfig(c.avatar),
    allow.mainnet.aaveV4.mapleSpoke.updateUserRiskPremium(c.avatar),

    // Curve - USDG/USDC StableSwap-NG pool (coins(0) USDG, coins(1) USDC): atomic swap both
    // ways, for a same-transaction repay of the USDG debt. Also needed here because every call
    // of the Sub roles (HF_KEEPER, EXIT, CARRY_TRADE_MANAGER) passes this role too. The
    // 4-argument `exchange` pays msg.sender (the avatar); the 5-argument variant with a receiver
    // stays closed. Roles cannot bound `min_dy`, the caller sets it.
    allowErc20Approve([USDC, USDG], [curveUsdgUsdcPool]),
    allow.mainnet.curve.usdgUsdcPool["exchange(int128,int128,uint256,uint256)"](
      0,
      1
    ),
    allow.mainnet.curve.usdgUsdcPool["exchange(int128,int128,uint256,uint256)"](
      1,
      0
    ),

    // Maple - syrupUSDC (USDC router, whose pool() is syrupUSDC, checked onchain 9 Oct 2026)
    ...maplePool(USDC, maple.syrupUsdcRouter, syrupUSDC),
    // Maple - syrupUSDG (USDG router), the Aave v4 Maple Spoke loop collateral
    ...maplePool(USDG, maple.syrupUsdgRouter, syrupUSDG),
    // Maple - syrupUSDT (USDT router), the Aave v3 / Morpho syrupUSDT loop collateral
    ...maplePool(USDT, maple.syrupUsdtRouter, syrupUSDT),

    // Merkl - Claim incentives accrued by the avatar: the kpk USDC Yield RWA vault position,
    // the Aave v4 USDC borrow rebate (Core Hub since 1 Oct 2026, previously Prime Hub) and
    // any Aave v4 lend campaign. `users` is pinned to the avatar Safe so the role can never
    // claim to a third party; `tokens`/`amounts`/`proofs` stay open because the merkle proof
    // binds them. One `c.or` branch per array length: arity == number of reward tokens
    // settled in a single claim. Merkl's wrapper tokens (e.g. USDC
    // 0x4045FcF533C84578e754be939821d26A087FC7C9) unwrap on transfer.
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

    // Shares contract - Redemptions are paid out by the shares contract pulling the asset from
    // the avatar Safe (safeTransferFrom(avatar, receiver)), so it needs an allowance on
    // every asset the fund may settle in. The WBTC allowance was set at deploy outside
    // this role; cbBTC and cirBTC have none. Scoped so the allowance can be topped up or
    // reset to 0 through the role.
    allowErc20Approve([cbBTC, cirBTC, WBTC], [parameters.shares]),
  ] satisfies PermissionList
