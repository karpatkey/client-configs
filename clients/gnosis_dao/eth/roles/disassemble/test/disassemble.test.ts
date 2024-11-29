import { applyPermissions } from "../../../../../../test/helpers"
import { avatar } from "../../../../../../test/wallets"
import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "../permissions"
import kit from "../../../../../../test/kit"
import { balancer } from "../../../../../../eth-sdk/addresses"
import { parseEther } from "ethers"
import { COW, GNO } from "../../../../../../eth-sdk/addresses"

describe("GnosisDAO", () => {
  beforeAll(async () => {
    // fresh role with Institutional manage permissions
    await revertToBase()
    await applyPermissions(permissions)
  })

  describe("Exit Balancer One Coin", () => {
    it("exitPool", async () => {
      await expect(
        kit.asMember.balancer.vault.exitPool(
          balancer.b50Cow50GnoPid,
          avatar.address,
          avatar.address,
          {
            assets: [GNO, COW],
            minAmountsOut: [parseEther("20"), 0],
            userData:
              "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b49add3192ef435510000000000000000000000000000000000000000000000000000000000000000",
            toInternalBalance: false,
          }
        )
      ).toBeForbidden()
    })
  })
})
