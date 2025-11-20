import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  eETH,
  GHO,
  liquidETH,
  USDC,
  weETH,
  aura,
  balancerV2,
  convex,
  fluid,
  gearbox,
  kpk,
  morpho,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { auraWithdrawBalancer } from "@/exit_strategies/aura"
import { convexWithdraw } from "@/exit_strategies/convex"

export default [
  // Unwrap ETH
  allow.mainnet.weth.withdraw(),

  // Aave v3 Prime Market - Withdraw GHO
  allow.mainnet.aaveV3.poolPrimeV3.withdraw(GHO, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave Safety Module - Unstake AAVE and GHO
  allow.mainnet.aaveV2.stkAave.redeem(c.avatar),
  allow.mainnet.aaveV2.stkAave.cooldown(),
  allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
  allow.mainnet.aaveV2.stkGho.cooldown(),

  // Aura + Balancer - Unstake + Withdraw rETH/WETH
  auraWithdrawBalancer(aura.auraBrEthStableRewarder, balancerV2.bREthStablePid),
  {
    ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
    targetAddress: balancerV2.bREthStableGauge,
  },
  // Aura + Balancer - Unstake + Withdraw wstETH/WETH
  auraWithdrawBalancer(
    aura.auraBstEthStableRewarder,
    balancerV2.bStEthStablePid
  ),
  {
    ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
    targetAddress: balancerV2.bStEthStableGauge,
  },
  // Aura - Unlock
  allow.mainnet.aura.vlAura.processExpiredLocks(false),
  // Aura - Unstake
  allow.mainnet.aura.auraBalStakingRewarder.withdraw(),
  allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Convex - USDT/WBTC/WETH
  convexWithdraw(convex.cvxcrvUsdtWbtcWethRewarder),
  // Convex - GHO/cbBTC/WETH
  convexWithdraw(convex.cvxBtcGhoEthRewarder),
  // Convex - Unstake cvxCRV
  allow.mainnet.convex.stkCvxCrv.withdraw(),

  // Curve - USDT/WBTC/WETH
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  allow.mainnet.curve.crvUsdtWbtcWethGauge["withdraw(uint256)"](),
  // Curve - Tricrypto GHO (GHO/cbBTC/WETH)
  allow.mainnet.curve.btcGhoEthPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.btcGhoEthPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  allow.mainnet.curve.btcGhoEthGauge["withdraw(uint256)"](),

  // ether.fi - Liquid ETH Yield Vault - Withdraw
  // https://help.ether.fi/en/articles/284654-how-to-withdraw-from-liquid-vaults
  allowErc20Approve([liquidETH], [contracts.mainnet.etherfi.atomicQueue]),
  allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
    liquidETH,
    c.or(eETH, weETH)
  ),
  // ether.fi - EigenLayer Restaking
  // Request Withdrawal - A Withdraw Request NFT is issued
  allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
  allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
  // Funds can be claimed once the request is finalized
  allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
  // Unwrap weETH
  allow.mainnet.etherfi.weEth.unwrap(),

  // Fluid - Withdraw wstETH
  {
    ...allow.mainnet.fluid.fWeth["withdraw(uint256,address,address)"](
      undefined,
      c.avatar,
      c.avatar
    ),
    targetAddress: fluid.fwstEth,
  },
  {
    ...allow.mainnet.fluid.fWeth["redeem(uint256,address,address)"](
      undefined,
      c.avatar,
      c.avatar
    ),
    targetAddress: fluid.fwstEth,
  },

  // Gearbox - ETH v3 - Curator: kpk
  {
    ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWeth,
  },
  // Gearbox - wstETH v3 - Curator: kpk
  {
    ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWstEth,
  },

  // kpk - USD Prime Fund
  {
    ...allow.mainnet.kpk.shares.requestRedeem(undefined, undefined, c.avatar),
    targetAddress: kpk.usdPrimeFundShares,
  },
  // kpk - Renaissance Fund
  {
    ...allow.mainnet.kpk.shares.requestRedeem(undefined, undefined, c.avatar),
    targetAddress: kpk.renaissanceFundShares,
  },

  // Lido
  allow.mainnet.lido.wstEth.unwrap(),
  allow.mainnet.lido.unstEth.requestWithdrawals(undefined, c.avatar),
  allow.mainnet.lido.unstEth.requestWithdrawalsWstETH(undefined, c.avatar),
  allow.mainnet.lido.unstEth.claimWithdrawal(),
  allow.mainnet.lido.unstEth.claimWithdrawals(),

  // Morpho Vault - kpk ETH Prime v1.1
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthV1,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthV1,
  },
  // Morpho Vault - kpk ETH v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthV2,
  },
  // Morpho Vault - kpk EURC Yield v1.1
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcV1,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcV1,
  },
  // Morpho Vault - kpk EURC v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEurcV2,
  },
  // Morpho Vault - kpk USDC Prime v1.1
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcV1,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcV1,
  },
  // Morpho Vault - kpk USDC v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkUsdcV2,
  },

  // Spark - DSR_sDAI
  allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
  // Spark - SKY_sUSDS
  allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
  allow.mainnet.spark.sUsds.redeem(undefined, c.avatar, c.avatar),
  // Spark - Unstake SPK
  allow.mainnet.spark.stSpk.withdraw(c.avatar),
  allow.mainnet.spark.stSpk.redeem(c.avatar),
  allow.mainnet.spark.stSpk.claim(c.avatar),
  allow.mainnet.spark.stSpk.claimBatch(c.avatar),
] satisfies PermissionList
