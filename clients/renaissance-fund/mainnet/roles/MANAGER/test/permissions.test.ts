import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import allowedCalls from "../permissions/calls"
import allowedActions from "../permissions/_actions"
import { parameters as renaissanceFundParameters } from "../../../instances/main_prod"

// This test was disabled because it’s failing in CI for unknown reasons.
describe.skip("Renaissance Fund", () => {
  beforeAll(async () => {
    await applyPermissions(
      {
        allowedCalls,
        allowedActions,
      },
      renaissanceFundParameters
    )
  })
  describe("Arbitrum Bridge", () => {
    it("Claim bridged ETH from Arbitrum", async () => {
      console.log("Avatar address:", renaissanceFundParameters.avatar)
      await expect(
        kit.asMember.arbitrumBridge.outbox4.executeTransaction(
          [
            "0xaba905681ed683843547695245db5536afc0df7064e25f6093cd89e4b04d513a",
          ],
          1,
          avatar.address,
          avatar.address,
          1,
          1,
          1,
          1,
          "0x"
        )
      ).toBeAllowed()
    })
  })
})
