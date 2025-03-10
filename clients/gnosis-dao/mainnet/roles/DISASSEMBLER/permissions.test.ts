import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { balancerV2 } from "@/addresses/eth"
import { parseEther } from "ethers"
import { COW, GNO } from "@/addresses/eth"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

describe("GnosisDAO", () => {
  beforeAll(async () => {
    // fresh role with Institutional manage permissions
    await applyPermissions({
      allowedCalls,
      allowedActions,
    })
  })

  describe("Exit Balancer One Coin", () => {
    it("exitPool", async () => {
      await expect(
        kit.asMember.balancer.vault.exitPool(
          balancerV2.b50Cow50GnoPid,
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
