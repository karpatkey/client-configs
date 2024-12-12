import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import { GNO, USDC, USDCe } from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // StakeWise v3 - Genesis
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.genesis]),
  allow.gnosis.stakeWiseV3.genesis.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.updateState(),
  allow.gnosis.stakeWiseV3.genesis.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.genesis.burnOsToken(),
  allow.gnosis.stakeWiseV3.genesis.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.genesis.claimExitedAssets(),

  // StakeWise v3 - Serenita
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.serenita]),
  allow.gnosis.stakeWiseV3.serenita.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.updateState(),
  allow.gnosis.stakeWiseV3.serenita.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.serenita.burnOsToken(),
  allow.gnosis.stakeWiseV3.serenita.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.serenita.claimExitedAssets(),

  // StakeWise v3 - NEDO
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.nedo]),
  allow.gnosis.stakeWiseV3.nedo.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.updateState(),
  allow.gnosis.stakeWiseV3.nedo.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.nedo.burnOsToken(),
  allow.gnosis.stakeWiseV3.nedo.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.nedo.claimExitedAssets(),

  /*********************************************
   * Swaps
   *********************************************/
  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.withdraw(),
  // Swap USDC -> USDC.e
  ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
  allow.gnosis.usdcTransmuter.deposit(),

  /*********************************************
   * Bridge
   *********************************************/
  // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
  allow.gnosis.navCalculator.bridgeStart(),

  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
    send: true,
  }),

  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),

  // GNO (Gnosis) -> GNO (Mainnet)
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),
] satisfies PermissionList
