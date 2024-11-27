import { parseEther } from "ethers"
import { applyPermissions, wrapEth } from "../../../../../../test/helpers"

import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "./permissions"
import kit from "../../../../../../test/kit"

describe("auraRelocker", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
    await revertToBase()
    await applyPermissions(permissions)

    // acquire 1 WETH for avatar
    await wrapEth(parseEther("1"))
  })

  it("allows claiming rewards from the zap only with lockCvx", async () => {
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
          lockCvx: false,
        }
      )
    ).toBeForbidden()

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
  })
})
