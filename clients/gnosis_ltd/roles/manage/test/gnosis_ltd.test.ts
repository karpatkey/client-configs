import {
  formatBytes32String,
  id,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from "ethers/lib/utils"
import { applyPermissions } from "../../../../../test/helpers"
import { testKit } from "../../../../../test/kit"
import { revertToBase } from "../../../../../test/snapshot"
import permissions from "../permissions"
import { contracts } from "../../../../../eth-sdk/config"
import { ZERO_ADDRESS, ENS, WETH } from "../../../../../eth-sdk/addresses"

describe("GnosisLTD", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
    await revertToBase()
    await applyPermissions(permissions)

    // // acquire 1 WETH for avatar
    // await wrapEth(parseEther("1"));
  })
  describe("lido", () => {
    it("deposit", async () => {
      await expect(
        testKit.eth.lido.stETH.callStatic.submit(ZERO_ADDRESS, {
          value: parseEther("1"),
        })
      ).not.toRevert()
    })
  })
})
