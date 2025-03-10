import { parseEther } from "ethers"
import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import { zeroAddress } from "@/addresses"
import allowedCalls from "../permissions/calls"
import allowedActions from "../permissions/_actions"

describe("GnosisLTD", () => {
  beforeAll(async () => {
    await applyPermissions({
      allowedCalls,
      allowedActions,
    })

    // // acquire 1 WETH for avatar
    // await wrapEth(parseEther("1"));
  })
  describe("lido", () => {
    it("deposit", async () => {
      await expect(
        kit.asMember.lido.stEth.submit(zeroAddress, {
          value: parseEther("1"),
        })
      ).not.toRevert()
    })
  })
})
