import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  GHO,
  GNO,
  ETHx,
  EURA,
  OLAS,
  SAFE,
  stETH,
  stkGHO,
  wstETH,
  balancerV2,
  maverickV2,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Angle - wstETH-EUR-Vault
    ...allowErc20Approve(
      [wstETH, EURA],
      [contracts.mainnet.angle.wstEthEurVault]
    ),
    allow.mainnet.angle.wstEthEurVault[
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
    ...allowErc20Approve([OLAS], [contracts.mainnet.autonolas.veOlas]),
    allow.mainnet.autonolas.veOlas.createLock(),
    allow.mainnet.autonolas.veOlas.increaseAmount(),
    allow.mainnet.autonolas.veOlas.increaseUnlockTime(),
    // Autonolas - OLAS Withdraw
    allow.mainnet.autonolas.veOlas.withdraw(),

    // Balancer - ECLP-bCSPX-sDAI Gauge
    ...allowErc20Approve([GNO], [contracts.gnosis.balancer.eclpBcspxSdaiGauge]),
    allow.gnosis.balancer.eclpBcspxSdaiGauge.set_reward_distributor(
      GNO,
    ),

    // Enzyme - Diva stETH Vault
    // Deposit stETH
    ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.divaStEthVault]),
    allow.mainnet.enzyme.divaStEthVault.buyShares(),
    // Withdraw stETH
    allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(
      c.avatar,
      undefined,
      [],
      [],
    ),

    // Enzyme - ETHx Hyperloop Vault
    // Deposit ETHx
    ...allowErc20Approve([ETHx], [contracts.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy]),
    allow.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy.buyShares(),
    // Withdraw ETHx
    allow.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy.redeemSharesInKind(
      c.avatar,
      undefined,
      [],
      [],
    ),

    // // Maverick v2 - stkGHO/GHO Pool
    // // Add liquidity
    // ...allowErc20Approve([GHO, stkGHO], [contracts.mainnet.maverickV2.rewardRouter]),
    // allow.mainnet.maverickV2.rewardRouter.mintPositionNftToSender(
    //   maverickV2.ghoStkGhoPool,
    // ),
    // // Withdraw liquidity
    // allow.mainnet.maverickV2.position.checkDeadline(),
    // allow.mainnet.maverickV2.position.checkSqrtPrice(
    //   maverickV2.ghoStkGhoPool,
    // ),
    // allow.mainnet.maverickV2.position.removeLiquidity(
    //   undefined,
    //   c.avatar,
    //   maverickV2.ghoStkGhoPool,
    // ),

    // Merkl (Angle) - Claim
    allow.mainnet.merkl.angleDistributor.claim([parameters.avatar], [GHO]),

    // SAFE - Claim
    allow.mainnet.safe.ecosystemAirdrop.claimVestedTokens(undefined, c.avatar),
    allow.mainnet.safe.userAirdrop.claimVestedTokens(undefined, c.avatar),
    allow.mainnet.safe.userAirdropSep5.claimVestedTokens(undefined, c.avatar),
    // SAFE - Lock
    ...allowErc20Approve([SAFE], [contracts.mainnet.safe.tokenLock]),
    allow.mainnet.safe.tokenLock.lock(),

    // Sommelier - TurboDIVETH
    ...allowErc20Approve(
      [balancerV2.bREthStable],
      [contracts.mainnet.sommelier.turboDivEth]
    ),
    allow.mainnet.sommelier.turboDivEth.deposit(undefined, c.avatar),
    allow.mainnet.sommelier.turboDivEth.redeem(undefined, c.avatar, c.avatar),
  ] satisfies PermissionList
