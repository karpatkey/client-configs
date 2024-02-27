import ensManageTestTransactions from "../clients/ens/mainnet/roles/manage/test/transactions"
import { roles as ensRoles } from "../clients/ens/mainnet"
import { TestTransaction } from "../test/types"
import { applyPermissions, callThroughRole } from "../test/helpers"
import { revertToBase } from "../test/snapshot"
import { PermissionList } from "../types"

const makePermissionsTest =
  (permissions: PermissionList, testTransactions: TestTransaction[]) => () =>
    it("passes all test transactions", async () => {
      await applyPermissions(permissions)
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
