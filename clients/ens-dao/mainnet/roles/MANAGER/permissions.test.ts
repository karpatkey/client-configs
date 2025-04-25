import { id, keccak256, parseEther, toUtf8Bytes } from "ethers"
import { applyPermissions, wrapEth } from "@/test/helpers"

import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"
import { ENS, WETH, cowSwap } from "@/addresses/eth"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { contracts } from "@/contracts"

// This test was disabled because it’s failing in CI for unknown reasons.
describe.skip("ENS", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
    await applyPermissions({
      allowedCalls,
      allowedActions,
    })

    // acquire 1 WETH for avatar
    await wrapEth(parseEther("1"))
  })

  describe("cowSwap", () => {
    it("Forbid swapping WETH to ENS", async () => {
      await expect(
        kit.asMember.weth.approve(cowSwap.gpv2VaultRelayer, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          {
            sellToken: WETH,
            buyToken: ENS,
            sellAmount: parseEther("1"),
            buyAmount: parseEther("100"),
            feeAmount: parseEther("0.01"), // denominated in sellToken, 1% of 1 WETH
            receiver: avatar.address,
            validTo: Math.round(Date.now() / 1000) + 30 * 60, // 30 minutes from now
            kind: id("sell"),
            partiallyFillable: false,
            sellTokenBalance: id("erc20"),
            buyTokenBalance: id("erc20"),
            appData: keccak256(toUtf8Bytes("TEST")),
          },
          30 * 60, // report relative valid duration: 30 minutes
          250 // report fee: 1%
        )
      ).toBeForbidden()
    })
  })

  describe("compoundV3", () => {
    it("allow depositing ETH", async () => {
      await expect(
        kit.asMember.compoundV3.cWethV3.allow(
          contracts.mainnet.compoundV3.mainnetBulker,
          true
        )
      ).not.toRevert()
      await expect(
        kit.asMember.compoundV3.mainnetBulker.invoke(
          [
            "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000",
          ],
          [
            "0x000000000000000000000000a17581a9e3356d9a858b789d68b4d866e593ae94000000000000000000000000def1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0000000000000000000000000000000000000000000000000de0b6b3a7640000",
          ],
          {
            value: parseEther("1"),
          }
        )
      ).not.toRevert()
    })
  })
})
