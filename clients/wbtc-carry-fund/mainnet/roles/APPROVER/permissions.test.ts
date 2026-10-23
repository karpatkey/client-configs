import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import { cbBTC, USDC, WBTC } from "@/addresses/eth"
import { parameters } from "../../instances/manager_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// Not the fund's shares contract
const stranger = "0x000000000000000000000000000000000000dEaD"

const shares = () => kit.asMember.oiv.shares.attach(parameters.shares)

describe("wbtc-carry-fund mainnet APPROVER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("OIV Shares: processRequests per settlement asset", () => {
    it("processes requests settled in WBTC", async () => {
      await expect(shares().processRequests([], [], WBTC, 1n)).toBeAllowed()
    })

    it("processes requests settled in cbBTC", async () => {
      await expect(shares().processRequests([], [], cbBTC, 1n)).toBeAllowed()
    })

    it("does not process requests settled in any other asset", async () => {
      await expect(shares().processRequests([], [], USDC, 1n)).toBeForbidden()
    })

    it("only calls the fund's shares contract", async () => {
      await expect(
        kit.asMember.oiv.shares
          .attach(stranger)
          .processRequests([], [], WBTC, 1n)
      ).toBeForbidden()
    })
  })
})
