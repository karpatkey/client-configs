import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { morpho, USDC, XAUt } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// The USDC vaults the manager deploys the borrowed USDC into.
const usdcVaults = [
  morpho.kpkUsdcYieldV2,
  morpho.kpkUsdcYieldRWA,
  morpho.kpkYoEcosystem,
]

// The kpk-agents carry-trade manager for this fund, on its own signer (replaces the HF
// keeper). Only the calls the manager signs: XAUt collateral on Aave v3 Core (supply, enable as
// collateral, withdraw), USDC debt (borrow / repay, in _actions.ts), and the borrowed USDC
// deposited into and withdrawn from kpk USDC Yield v2, kpk USDC Yield RWA and the YO Ecosystem
// Vault, always for the avatar. A vault is drained with `withdraw` by amount, never `redeem`,
// `mint` or `forceDeallocate`. No USDC supply on Aave (the manager does not supply its own
// borrow venue), no Compound v3, no yoUSD Edge (entered and exited by the MANAGER), no eMode
// switch (the MANAGER sets category 43), no swaps, nothing on behalf of or to a third party.
export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - XAUt collateral: supply for the avatar, enable as collateral (only
    // ever `true`), withdraw to the avatar. The Pool pulls XAUt on supply, hence the approval.
    // Hand-scoped rather than defi-kit's aave_v3.deposit, which would also let the role
    // disable XAUt as collateral and claim rewards.
    allowErc20Approve([XAUt], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(XAUt, true),
    allow.mainnet.aaveV3.poolCoreV3.supply(XAUt, undefined, c.avatar),
    allow.mainnet.aaveV3.poolCoreV3.withdraw(XAUt, undefined, c.avatar),

    // Morpho Vaults - USDC approval, deposit and withdraw for the avatar, per vault.
    // Hand-scoped rather than defi-kit's morphoVaults.deposit, which would also grant `redeem`.
    allowErc20Approve([USDC], usdcVaults),
    ...usdcVaults.flatMap((vault) => [
      {
        ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
        targetAddress: vault,
      },
      {
        ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
        targetAddress: vault,
      },
    ]),
  ] satisfies PermissionList
