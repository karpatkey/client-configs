import { applyPermissions } from "@/test/helpers"
import { AURA } from "@/addresses/eth"
import { contracts } from "@/contracts"
import * as permissions from "./permissions"
import kit from "@/test/kit"

describe("auraRelocker", () => {
  beforeAll(async () => {
    await applyPermissions(permissions)
  })

  it("Allows claiming all kinds of rewards from the zap, with the option to relock AURA tokens. It can also process expired locked tokens", async () => {
    await expect(
      kit.asMember.weth
        .attach(AURA)
        .approve(contracts.mainnet.aura.claimZapV3, 87623879238792)
    )

    await expect(
      kit.asMember.aura.claimZapV3.claimRewards(
        [
          "0x89D3D732da8bf0f88659Cf3738E5E44e553f9ED7",
          "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D",
        ],
        ["0xAc16927429c5c7Af63dD75BC9d8a58c63FfD0147"],
        [],
        [],
        {
          depositCrvMaxAmount: 0,
          depositCvxMaxAmount: 0,
          depositCvxCrvMaxAmount: 0,
          minAmountOut: 0,
        },
        {
          claimCvxCrv: false,
          claimLockedCvx: false,
          lockCvxCrv: false,
          lockCrvDeposit: false,
          useAllWalletFunds: false,
          useCompounder: false,
          lockCvx: true,
        }
      )
    ).toBeAllowed()

    await expect(
      kit.asMember.aura.claimZapV3.claimRewards(
        [
          "0x89D3D732da8bf0f88659Cf3738E5E44e553f9ED7",
          "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D",
        ],
        ["0xAc16927429c5c7Af63dD75BC9d8a58c63FfD0147"],
        [],
        [],
        {
          depositCrvMaxAmount: 0,
          depositCvxMaxAmount: 0,
          depositCvxCrvMaxAmount: 0,
          minAmountOut: 0,
        },
        {
          claimCvxCrv: false,
          claimLockedCvx: false,
          lockCvxCrv: false,
          lockCrvDeposit: false,
          useAllWalletFunds: false,
          useCompounder: false,
          lockCvx: true,
        }
      )
    ).toBeAllowed()

    await expect(
      kit.asMember.aura.vlAura.processExpiredLocks(true)
    ).toBeAllowed()
  })
})
