import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  eETH,
  USDC,
  USDT,
  WBTC,
  weETH,
  WETH,
  XAUt,
  fluid,
  gearbox,
  kpk,
  morpho,
} from "@/addresses/eth"
import { eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"

export default [
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Aave Safety Module - Unstake AAVE
  allow.mainnet.aaveV3.stkAave.cooldown(),
  allow.mainnet.aaveV3.stkAave.redeem(c.avatar),

  // ether.fi - Unstake
  // Standard unstaking eETH -> ETH - A Withdraw Request NFT is issued
  allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
  allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
  // Standard unstaking weETH -> ETH - A Withdraw Request NFT is issued
  allowErc20Approve([weETH], [contracts.mainnet.etherfi.withdrawalAdapter]),
  allow.mainnet.etherfi.withdrawalAdapter.requestWithdraw(undefined, c.avatar),
  // Funds can be claimed once the request is finalized
  allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
  // Express (instant) unstaking eETH -> ETH
  allowErc20Approve([eETH], [contracts.mainnet.etherfi.redemptionManager]),
  allow.mainnet.etherfi.redemptionManager.redeemEEth(
    undefined,
    c.avatar,
    eAddress
  ),
  // Express (instant) unstaking weETH -> ETH
  allowErc20Approve([weETH], [contracts.mainnet.etherfi.redemptionManager]),
  allow.mainnet.etherfi.redemptionManager.redeemWeEth(
    undefined,
    c.avatar,
    eAddress
  ),
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
    ...allow.mainnet.gearbox.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWeth,
  },
  {
    ...allow.mainnet.gearbox.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWeth,
  },
  // Gearbox - wstETH v3 - Curator: kpk
  {
    ...allow.mainnet.gearbox.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWstEth,
  },
  {
    ...allow.mainnet.gearbox.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: gearbox.kpkWstEth,
  },

  // KPK - ETH Alpha Fund
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      WETH,
      c.avatar
    ),
    targetAddress: kpk.ethAlphaFundShares,
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
  // KPK - WBTC Carry Fund
  {
    ...allow.mainnet.oiv.shares.requestRedemption(
      undefined,
      undefined,
      WBTC,
      c.avatar
    ),
    targetAddress: kpk.wbtcCarryFundShares,
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

  // Lido - Unwrap wstETH + request withdrawals (stETH and wstETH)
  allow.mainnet.lido.wstEth.unwrap(),
  allow.mainnet.lido.unstEth.requestWithdrawals(undefined, c.avatar),
  allow.mainnet.lido.unstEth.requestWithdrawalsWstETH(undefined, c.avatar),

  // Morpho Vault - kpk ETH Prime v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthPrimeV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthPrimeV2,
  },
  // Morpho Vault - kpk ETH Yield v2
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthYieldV2,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: morpho.kpkEthYieldV2,
  },

  // Rocket Pool - Unstake rETH
  allow.mainnet.rocketPool.rEth.burn(),
  allow.mainnet.rocketPool.swapRouter.swapFrom(),

  // Spark - Unstake SPK
  allow.mainnet.spark.stSpk.withdraw(c.avatar),
  allow.mainnet.spark.stSpk.redeem(c.avatar),
] satisfies PermissionList
