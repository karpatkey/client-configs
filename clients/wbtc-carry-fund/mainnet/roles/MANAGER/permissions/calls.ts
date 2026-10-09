import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  AAVE,
  aaveV4Spokes,
  cbBTC,
  cirBTC,
  EURC,
  frxUSD,
  GHO,
  LBTC,
  LINK,
  maple,
  morpho,
  PAXG,
  RLUSD,
  rsETH,
  sUSDe,
  syrupUSDC,
  syrupUSDG,
  syrupUSDT,
  USDC,
  USDe,
  USDG,
  USDT,
  WBTC,
  weETH,
  WETH,
  wstETH,
  XAUt,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import {
  morphoBackupMarkets,
  morphoSyrupUsdtUsdtMarket,
} from "../../../addresses"
import { Parameters } from "../../../parameters"

const morphoBlue = contracts.mainnet.morpho.morphoBlue
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// ---------------------------------------------------------------------------------------
// Aave v4 - everything a position holder can do, on every Spoke, for the avatar only.
//
// Policy (Giel, 9 Oct 2026): any Aave v4 strategy should be possible without another
// Security Council round, so the reserve id is left open on every Spoke. That also covers
// reserves listed later (e.g. cirBTC). What stays closed: acting for anyone but the avatar
// (onBehalfOf pinned), position managers (setUserPositionManager, the WithSig variant,
// renouncePositionManagerRole), multicall, permitReserve, liquidationCall and every admin
// function. All Spokes share these user functions; checked against each implementation's
// bytecode on 9 Oct 2026. The Bluechip Spoke ABI is used with each Spoke as target.
// ---------------------------------------------------------------------------------------

const spokes = Object.values(aaveV4Spokes)
const spokeAbi = allow.mainnet.aaveV4.bluechipSpoke

const onEverySpoke = (permission: { targetAddress: string }) =>
  spokes.map((spoke) => ({ ...permission, targetAddress: spoke }))

// Every underlying listed on a mainnet Spoke on 9 Oct 2026 (expired PTs left out), plus
// cirBTC, whose Aave listing is expected. A Spoke pulls the asset on supply and repay, hence
// the approvals. Approving a Spoke that does not list a token is harmless.
const aaveV4Tokens = [
  WBTC,
  cbBTC,
  cirBTC,
  LBTC,
  USDC,
  USDT,
  USDG,
  GHO,
  frxUSD,
  RLUSD,
  EURC,
  USDe,
  sUSDe,
  syrupUSDG,
  WETH,
  wstETH,
  weETH,
  rsETH,
  AAVE,
  LINK,
  XAUt,
  PAXG,
] as const

const aaveV4 = [
  allowErc20Approve(aaveV4Tokens, spokes),
  ...onEverySpoke(spokeAbi.supply(undefined, undefined, c.avatar)),
  ...onEverySpoke(spokeAbi.withdraw(undefined, undefined, c.avatar)),
  ...onEverySpoke(spokeAbi.borrow(undefined, undefined, c.avatar)),
  ...onEverySpoke(spokeAbi.repay(undefined, undefined, c.avatar)),
  // `supply` does not enable a reserve as collateral, it has to be set explicitly
  ...onEverySpoke(
    spokeAbi.setUsingAsCollateral(undefined, undefined, c.avatar)
  ),
  // Refresh the avatar's own risk premium / dynamic config after collateral changes
  ...onEverySpoke(spokeAbi.updateUserRiskPremium(c.avatar)),
  ...onEverySpoke(spokeAbi.updateUserDynamicConfig(c.avatar)),
]

// Morpho Blue - one market, pinned by its full MarketParams: supply/withdraw collateral,
// borrow/repay the loan token. onBehalf and receiver pinned to the avatar, callback data
// pinned to empty.
const morphoMarket = (market: {
  loanToken: string
  collateralToken: string
  oracle: string
  irm: string
  lltv: string
}) => [
  allow.mainnet.morpho.morphoBlue.supplyCollateral(
    market,
    undefined,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morphoBlue.withdrawCollateral(
    market,
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.mainnet.morpho.morphoBlue.borrow(
    market,
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  allow.mainnet.morpho.morphoBlue.repay(
    market,
    undefined,
    undefined,
    c.avatar,
    "0x"
  ),
]

export default (parameters: Parameters) =>
  [
    ...aaveV4,

    // Shares contract - Redemptions are paid out by the shares contract pulling the asset from
    // the avatar Safe (safeTransferFrom(avatar, receiver)), so it needs an allowance on
    // every asset the fund may settle in. The WBTC allowance was set at deploy outside
    // this role; cbBTC and cirBTC have none. Scoped so the allowance can be topped up or
    // reset to 0 through the role.
    allowErc20Approve([WBTC, cbBTC, cirBTC], [parameters.shares]),

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

    // ---------------------------------------------------------------------------------
    // Aave v3 Core - backup borrow venue and the syrupUSDT loop (e-mode 33). Supply,
    // withdraw, collateral and borrow / repay come from defi-kit in _actions.ts. Added here:
    // e-mode switching, and cirBTC, which defi-kit does not list yet (Aave v3 keys reserves
    // by token address, so this works from the day it is listed).
    // ---------------------------------------------------------------------------------
    allow.mainnet.aaveV3.poolCoreV3.setUserEMode(),
    allowErc20Approve([cirBTC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.supply(cirBTC, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(cirBTC, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(cirBTC),

    // ---------------------------------------------------------------------------------
    // Maple syrup tokens (the loop sleeve). The pools are permissioned at function level by
    // the PoolPermissionManager (0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3): `deposit`
    // needs lender bitmap 16, and the avatar's bitmap is 0. `authorizeAndDeposit` covers the
    // one-time Maple-signed onboarding: Maple signs (router, msg.sender, nonce, bitmap,
    // deadline) for THIS Safe, so its arguments are left open on purpose. The routers pull
    // the asset from the caller, hence the approvals. Exits go through each pool's queue:
    // requestRedeem enqueues shares, removeShares cancels, redeem collects a processed request
    // in manual mode. Owner and receiver pinned to the avatar. `withdraw` and
    // `requestWithdraw` are not scoped: the PoolManager reverts them.
    // ---------------------------------------------------------------------------------

    // syrupUSDG (USDG router)
    allowErc20Approve([USDG], [maple.syrupUsdgRouter]),
    {
      ...allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
      targetAddress: maple.syrupUsdgRouter,
    },
    {
      ...allow.mainnet.maple.syrupRouter.deposit(),
      targetAddress: maple.syrupUsdgRouter,
    },
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

    // syrupUSDT (USDT router). USDT only accepts a new non-zero allowance from 0;
    // `allowErc20Approve` leaves the amount open, so resetting to 0 is allowed.
    allowErc20Approve([USDT], [maple.syrupUsdtRouter]),
    allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
    allow.mainnet.maple.syrupRouter.deposit(),
    allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
    allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),

    // syrupUSDC (USDC router 0x134cCaaA4F1e4552eC8aEcb9E4A2360dDcF8df76, whose pool() is
    // syrupUSDC, checked onchain 9 Oct 2026)
    allowErc20Approve([USDC], [maple.syrupUsdcRouter]),
    {
      ...allow.mainnet.maple.syrupRouter.authorizeAndDeposit(),
      targetAddress: maple.syrupUsdcRouter,
    },
    {
      ...allow.mainnet.maple.syrupRouter.deposit(),
      targetAddress: maple.syrupUsdcRouter,
    },
    {
      ...allow.mainnet.maple.syrupPool.requestRedeem(undefined, c.avatar),
      targetAddress: syrupUSDC,
    },
    {
      ...allow.mainnet.maple.syrupPool.removeShares(undefined, c.avatar),
      targetAddress: syrupUSDC,
    },
    {
      ...allow.mainnet.maple.syrupPool.redeem(undefined, c.avatar, c.avatar),
      targetAddress: syrupUSDC,
    },

    // ---------------------------------------------------------------------------------
    // Morpho Blue markets, each pinned by its full MarketParams. Morpho pulls collateral
    // and the loan token from the caller, hence the approvals.
    //  - syrupUSDT/USDT (91.5%): the syrupUSDT loop, as in the XAUt fund's leg 2 (#263)
    //  - syrupUSDC/USDC (two 91.5% markets): the syrupUSDC loop, if USDC Prime funds it
    //  - WBTC / cbBTC against USDC / USDT (86%): backup borrow venues for the BTC leg
    // ---------------------------------------------------------------------------------
    allowErc20Approve(
      [WBTC, cbBTC, syrupUSDT, syrupUSDC, USDC, USDT],
      [morphoBlue]
    ),
    ...morphoMarket(morphoSyrupUsdtUsdtMarket),
    ...morphoMarket(morphoBackupMarkets.syrupUsdcUsdc),
    ...morphoMarket(morphoBackupMarkets.syrupUsdcUsdc2),
    ...morphoMarket(morphoBackupMarkets.cbBtcUsdc),
    ...morphoMarket(morphoBackupMarkets.wbtcUsdc),
    ...morphoMarket(morphoBackupMarkets.wbtcUsdt),
    ...morphoMarket(morphoBackupMarkets.cbBtcUsdt),
  ] satisfies PermissionList
