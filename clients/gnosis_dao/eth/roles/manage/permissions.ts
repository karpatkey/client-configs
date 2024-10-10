import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  DAI,
  GHO,
  EURA,
  OLAS,
  osETH,
  rETH,
  SAFE,
  stETH,
  USDC,
  USDT,
  WETH,
  wstETH,
  balancer,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of AAVE and GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),
  // Aave v3 - Borrow WBTC
  allowAction.aave_v3.borrow({ targets: ["WBTC"] }),

  // Ankr
  allowAction.ankr.deposit(),

  // Aura - auraBAL
  allowAction.aura.deposit({ targets: ["101"] }),
  // Aura - COW/GNO
  allowAction.aura.deposit({ targets: ["104"] }),
  // Aura - COW/WETH
  allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer - auraBAL
  allowAction.balancer.deposit({ targets: ["B-auraBAL-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-auraBAL-STABLE"] }),
  // Balancer - COW/GNO
  allowAction.balancer.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50COW-50GNO"] }),
  // Balancer - COW/WETH
  allowAction.balancer.deposit({ targets: ["50COW-50WETH"] }),
  allowAction.balancer.stake({ targets: ["50COW-50WETH"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - Lock
  allowAction.balancer.lock(),

  // Convex - Lock
  allowAction.convex.lock(),

  // CowSwap - DAI <> USDT
  allowAction.cowswap.swap({
    sell: [DAI, USDT],
    buy: [DAI, USDT],
  }),
  // CowSwap - USDC <> USDT
  allowAction.cowswap.swap({
    sell: [USDC, USDT],
    buy: [USDC, USDT],
  }),
  // CowSwap - wstETH -> stETH
  allowAction.cowswap.swap({
    sell: [wstETH],
    buy: [stETH],
  }),
  // CowSwap - osETH <> WETH
  allowAction.cowswap.swap({
    sell: [osETH, WETH],
    buy: [osETH, WETH],
  }),
  // CowSwap - rETH <> WETH
  allowAction.cowswap.swap({
    sell: [rETH, WETH],
    buy: [rETH, WETH],
  }),
  // CowSwap - GHO <> USDC
  allowAction.cowswap.swap({
    sell: [GHO, USDC],
    buy: [GHO, USDC],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Angle - wstETH-EUR-Vault
  ...allowErc20Approve(
    [wstETH, EURA],
    [contracts.mainnet.angle.wstETH_EUR_Vault]
  ),
  allow.mainnet.angle.wstETH_EUR_Vault[
    "angle(uint8[],bytes[],address,address)"
  ](
    c.every(
      c.or(
        1, // closeVault
        2, // addCollateral
        3, // removeCollateral
        4, // repayDebt
        5 // borrow
      )
    ),
    c.every(
      c.or(
        c.abiEncodedMatches(
          [19],
          ["uint256"] // (vaultID)
        ), // closeVault
        c.abiEncodedMatches(
          [19],
          ["uint256", "uint256"] // 2,3:(vaultID, collateralAmount) or 4,5:(vaultID, stablecoinAmount)
        ) // addCollateral, removeCollateral, repayDebt, borrow
      )
    ),
    c.avatar,
    c.avatar
  ),

  // Autonolas - OLAS Lock
  ...allowErc20Approve([OLAS], [contracts.mainnet.autonolas.veolas]),
  allow.mainnet.autonolas.veolas.createLock(),
  allow.mainnet.autonolas.veolas.increaseAmount(),
  allow.mainnet.autonolas.veolas.increaseUnlockTime(),
  // Autonolas - OLAS Withdraw
  allow.mainnet.autonolas.veolas.withdraw(),

  // Enzyme - Diva stETH Vault
  // Deposit ETH
  allow.mainnet.enzyme.deposit_wrapper_2.exchangeEthAndBuyShares(
    contracts.mainnet.enzyme.Diva_stETH_Vault,
    undefined,
    "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57", // Paraswap v5: Augustus Swapper Mainnet
    "0x216B4B4Ba9F3e719726886d34a177484278Bfcae", // Paraswap v5: Token TransferProxy Mainnet
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  // Deposit stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.Diva_stETH_Vault]),
  allow.mainnet.enzyme.Diva_stETH_Vault.buyShares(),
  // Withdraw stETH
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
  ),

  // Merkl (Angle) - Claim
  allow.mainnet.merkl.angle_distributor.claim([avatar], [GHO]),

  // SAFE - Claim
  allow.mainnet.safe.ecosystem_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop_sep5.claimVestedTokens(undefined, c.avatar),
  // SAFE - Lock
  ...allowErc20Approve([SAFE], [contracts.mainnet.safe.token_lock]),
  allow.mainnet.safe.token_lock.lock(),

  // Sommelier - TurboDIVETH
  ...allowErc20Approve(
    [balancer.B_rETH_stable],
    [contracts.mainnet.sommelier.TurboDIVETH]
  ),
  allow.mainnet.sommelier.TurboDIVETH.deposit(undefined, c.avatar),
  allow.mainnet.sommelier.TurboDIVETH.redeem(undefined, c.avatar, c.avatar),

  // StakeWise v3 - Chorus One - MEV Max
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.deposit(c.avatar, undefined, {
    send: true,
  }),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.updateState(),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.updateStateAndDeposit(
    c.avatar,
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.mintOsToken(c.avatar),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.burnOsToken(),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.enterExitQueue(
    undefined,
    c.avatar
  ),
  allow.mainnet.stakewise_v3.chrorus_one_mev_max.claimExitedAssets(),
] satisfies PermissionList
