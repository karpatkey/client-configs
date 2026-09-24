import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho, USDC, WBTC } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve as reserve } from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke

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
  ] satisfies PermissionList
