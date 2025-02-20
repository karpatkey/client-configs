import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  GHO,
  EURA,
  OLAS,
  SAFE,
  stETH,
  wstETH,
  balancerV2,
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

    // Enzyme - Diva stETH Vault
    // Deposit ETH
    allow.mainnet.enzyme.depositWrapper2.exchangeEthAndBuyShares(
      contracts.mainnet.enzyme.divaStEthVault,
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
    ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.divaStEthVault]),
    allow.mainnet.enzyme.divaStEthVault.buyShares(),
    // Withdraw stETH
    allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(c.avatar),
    allow.mainnet.enzyme.divaStEthVault.redeemSharesForSpecificAssets(
      c.avatar,
      undefined,
      [stETH]
    ),

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
