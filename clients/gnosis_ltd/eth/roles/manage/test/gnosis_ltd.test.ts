import { parseEther, toUtf8Bytes } from "ethers"
import { applyPermissions } from "../../../../../../test/helpers"
import kit from "../../../../../../test/kit"
import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "../permissions"
import { zeroAddress, ENS, WETH } from "@/addresses/eth"

describe("GnosisLTD", () => {
  beforeAll(async () => {
    await revertToBase()
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
