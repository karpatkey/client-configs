import { Permission } from "zodiac-roles-sdk"
import ensManageTestTransactions from "../clients/ens/roles/manage/test/transactions"
import { roles as ensRoles } from "../clients/ens"
import { TestTransaction } from "./types"
import { configurePermissions, callThroughRole } from "./helpers"
import { revertToBase } from "./snapshot"

const makePermissionsTest =
  (permissions: Permission[], testTransactions: TestTransaction[]) => () =>
    it("passes all test transactions", async () => {
      await configurePermissions(permissions)
      for (let tx of testTransactions) {
        console.log(
          `Simulating ${tx.operation === 1 ? "delegate call" : "call"} to ${
            tx.to
          } with data: ${tx.data}, value: ${tx.value}`
        )

        if (tx.expectRevert) {
          await expect(callThroughRole(tx)).toBeForbidden()
        } else {
          await expect(callThroughRole(tx)).toBeAllowed()
        }
      }
    })

describe("permissions", () => {
  beforeEach(revertToBase)

  describe("ENS", () => {
    describe(
      "manage",
      makePermissionsTest(
        ensRoles.manage.permissions,
        ensManageTestTransactions
      )
    )
  })
})
