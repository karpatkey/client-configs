import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  GNO,
  sDAI,
  USDC,
  USDT,
  WETH,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // CowSwap - Swap sDAI <-> [XDAI, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [sDAI],
    buy: ["XDAI", USDC, USDT],
    feeAmountBp: 200,
  }),
  allowAction.cowswap.swap({
    sell: ["XDAI", USDC, USDT],
    buy: [sDAI],
    feeAmountBp: 200,
  }),

  // CowSwap - Swap GNO <-> WETH
  allowAction.cowswap.swap({
    sell: [GNO, WETH],
    buy: [GNO, WETH],
    feeAmountBp: 200,
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
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

  // StakeWise v3 - Axol.io
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.axol]),
  allow.gnosis.stakeWiseV3.axol.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.axol.updateState(),
  allow.gnosis.stakeWiseV3.axol.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.axol.burnOsToken(),
  allow.gnosis.stakeWiseV3.axol.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.axol.claimExitedAssets(),

  // StakeWise v3 - Stakecat
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.stakecat]),
  allow.gnosis.stakeWiseV3.stakecat.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.updateState(),
  allow.gnosis.stakeWiseV3.stakecat.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakecat.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakecat.claimExitedAssets(),

  // StakeWise v3 - SEEDNode
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.seednode]),
  allow.gnosis.stakeWiseV3.seednode.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.seednode.updateState(),
  allow.gnosis.stakeWiseV3.seednode.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.seednode.burnOsToken(),
  allow.gnosis.stakeWiseV3.seednode.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.seednode.claimExitedAssets(),

  // StakeWise v3 - Stakesaurus
  allowErc20Approve([GNO], [contracts.gnosis.stakeWiseV3.stakesaurus]),
  allow.gnosis.stakeWiseV3.stakesaurus.deposit(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.updateState(),
  allow.gnosis.stakeWiseV3.stakesaurus.mintOsToken(c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.burnOsToken(),
  allow.gnosis.stakeWiseV3.stakesaurus.enterExitQueue(undefined, c.avatar),
  allow.gnosis.stakeWiseV3.stakesaurus.claimExitedAssets(),

  /*********************************************
   * Bridge
   *********************************************/
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
    send: true,
  }),

  // GNO (Gnosis) -> GNO (Mainnet)
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    avatar
  ),
] satisfies PermissionList
