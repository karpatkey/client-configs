import { parseEther } from "ethers"
import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import * as permissions from "../permissions"
import { zeroAddress } from "@/addresses"

describe("GnosisLTD", () => {
  beforeAll(async () => {
    await applyPermissions(permissions)

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
