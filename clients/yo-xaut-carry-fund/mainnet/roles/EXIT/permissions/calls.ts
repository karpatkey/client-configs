import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { compoundV3, morpho, USDC, XAUt } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3

// Morpho Vault exit legs: withdraw / redeem to the avatar, from the avatar, and force
// deallocate on behalf of the avatar. No deposit, no approval.
const morphoExit = (vault: `0x${string}`) => [
  {
    ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
    targetAddress: vault,
  },
  {
    ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
    targetAddress: vault,
  },
  {
    ...allow.mainnet.morpho.vault.forceDeallocate(
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    targetAddress: vault,
  },
]

export default (parameters: Parameters) =>
  [
    // Aave v3 Core Market - Repay USDC debt for the avatar (onBehalfOf pinned). The Pool pulls
    // the asset from the caller, hence the approval.
    allowErc20Approve([USDC], [poolCoreV3]),
    allow.mainnet.aaveV3.poolCoreV3.repay(USDC, undefined, undefined, c.avatar),

    // Aave v3 Core Market - Withdraw XAUt collateral to the avatar Safe: a full
    // loan_position_exit releases the collateral once the USDC debt is repaid
    allow.mainnet.aaveV3.poolCoreV3.withdraw(XAUt, undefined, c.avatar),

    // Aave v3 Core Market - Withdraw supplied USDC to the avatar Safe (`position_exit` kind
    // `aave_v3`)
    allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),

    // Compound v3 - Institutional Market (ciUSDCv3) - USDC supply position exit: withdraw(USDC)
    // for msg.sender (the avatar). XAUt is not a Comet collateral and no collateral is scoped,
    // so `withdraw(USDC)` can only pull supplied USDC, it cannot borrow. `supply(USDC)` (the
    // repay form, inherited from the cbBTC fund's EXIT) is kept for parity: it only adds to
    // the avatar's own USDC supply. The Comet pulls the asset from the caller, hence the
    // approval.
    allowErc20Approve([USDC], [compoundV3.ciUSDCv3]),
    {
      ...allow.mainnet.compoundV3.comet.supply(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(USDC),
      targetAddress: compoundV3.ciUSDCv3,
    },

    // Morpho Vault - kpk USDC Prime v2 - Withdraw/redeem/force deallocate
    ...morphoExit(morpho.kpkUsdcPrimeV2),
    // Morpho Vault - kpk USDC Yield v2 - Withdraw/redeem/force deallocate
    ...morphoExit(morpho.kpkUsdcYieldV2),
    // Morpho Vault - kpk USDC Yield RWA - Withdraw/redeem/force deallocate
    ...morphoExit(morpho.kpkUsdcYieldRWA),
    // Morpho Vault - KPK-curated YO Ecosystem Vault (USDC) - Withdraw/redeem/force deallocate
    ...morphoExit(morpho.kpkYoEcosystem),

    // yoUSD Edge (YO Protocol, USDC) - exit only: queue the shares for redemption. Instant
    // when the vault has idle USDC, otherwise YO fulfils later and pushes the USDC to
    // `receiver`. Receiver and owner pinned to the avatar. No deposit, no `withdraw` (always
    // reverts), no `mint`.
    allow.mainnet.yo.edgeVault.requestRedeem(undefined, c.avatar, c.avatar),
    allow.mainnet.yo.edgeVault.redeem(undefined, c.avatar, c.avatar),
  ] satisfies PermissionList
