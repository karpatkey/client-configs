import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  USDC,
  USDT,
  XAUt,
  euler,
  fluid,
  gearbox,
  kpk,
  morpho,
  symbiotic,
} from "@/addresses/eth"
import { PermissionList } from "@/types"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 - sGHO
  allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.aaveV3.sGho.redeem(undefined, c.avatar, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Euler - KPK RWA USDC
  {
    ...allow.mainnet.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: euler.kpkRwaUsdc,
  },
  {
    ...allow.mainnet.euler.eVault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: euler.kpkRwaUsdc,
  },

  // Fluid - Withdraw USDC
  {
    ...allow.mainnet.fluid.fWeth["withdraw(uint256,address,address)"](
      undefined,
      c.avatar,
      c.avatar
    ),
    targetAddress: fluid.fUsdc,
  },
  {
    ...allow.mainnet.fluid.fWeth["redeem(uint256,address,address)"](
      undefined,
      c.avatar,
      c.avatar
    ),
    targetAddress: fluid.fUsdc,
  },

  // Gearbox - frxUSD RWA Vault - Curator: kpk
  {
    ...allow.mainnet.gearbox.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkFrxUsd,
  },
  {
    ...allow.mainnet.gearbox.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkFrxUsd,
  },

  // KPK - USD Alpha Fund
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      c.or(USDC, USDT),
      c.avatar
    ),
    targetAddress: kpk.usdAlphaFundShares,
  },
  // KPK - XAUt Carry Fund
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      XAUt,
      c.avatar
    ),
    targetAddress: kpk.xautCarryFundShares,
  },

  // Morpho Vault - kpk USDC Prime v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcPrimeV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcPrimeV2,
  },
  // Morpho Vault - kpk USDC Yield v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldV2,
  },
  // Morpho Vault - kpk USDC Yield RWA
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldRWA,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcYieldRWA,
  },
  // Morpho Vault - kpk USDC Prime Core
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcPrimeCore,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcPrimeCore,
  },
  // Morpho Vault - kpk EURC Yield v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcYieldV2,
  },
  // Morpho Vault - kpk USDT Prime v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdtPrimeV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdtPrimeV2,
  },

  // Sky / Spark - SKY_sUSDS - Withdraw
  allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),

  // Symbiotic - KPK USDC LiquidLane (RWA Liquidity)
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: symbiotic.kpkUsdcLiquidLane,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: symbiotic.kpkUsdcLiquidLane,
  },
] satisfies PermissionList
