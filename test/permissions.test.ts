import { PresetAllowEntry } from "zodiac-roles-sdk";
import ensManageTestTransactions from "../clients/ens/roles/manage/test/transactions";
import { roles as ensRoles } from "../clients/ens";
import { TestTransaction } from "./types";
import { configurePermissions, execThroughRole } from "./helpers";

const makePermissionsTest =
  (permissions: PresetAllowEntry[], testTransactions: TestTransaction[]) =>
  () =>
    it("should allow all test transactions", async () => {
      await configurePermissions(permissions);
      for (let tx of testTransactions) {
        if (tx.expectRevert) {
          await expect(execThroughRole(tx)).toBeForbidden();
        } else {
          await expect(execThroughRole(tx)).toBeAllowed();
        }
      }
    });

describe("permissions", () => {
  describe("ENS", () => {
    describe(
      "manage",
      makePermissionsTest(
        ensRoles.manage.permissions,
        ensManageTestTransactions,
      ),
    );
  });
});
