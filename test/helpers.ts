import {
  PresetAllowEntry,
  applyPermissions,
  checkPermissionsIntegrity,
  fillPreset,
} from "zodiac-roles-sdk";
import { Roles__factory } from "./rolesModTypechain";
import { ROLES_ADDRESS, getMemberWallet, getOwnerWallet } from "./accounts";
import { formatBytes32String } from "ethers/lib/utils";

const owner = getOwnerWallet();

export const rolesMod = Roles__factory.connect(ROLES_ADDRESS, owner);
export const testRoleKey = formatBytes32String("TEST-ROLE");

export const configurePermissions = async (entries: PresetAllowEntry[]) => {
  const calls = await applyPermissions(
    testRoleKey,
    derivePermissions(entries),
    {
      address: rolesMod.address,
      currentPermissions: [],
      mode: "replace",
      log: console.debug,
    },
  );

  console.log(`Applying permissions with ${calls.length} calls`);
  let nonce = await owner.getTransactionCount();
  await Promise.all(
    calls.map(
      async (call) =>
        await owner.sendTransaction({
          to: rolesMod.address,
          data: call,
          nonce: nonce++,
        }),
    ),
  );
  console.log("Permissions applied");
};

export const execThroughRole = async ({
  to,
  data,
  value,
}: {
  to: `0x${string}`;
  data?: `0x${string}`;
  value?: `0x${string}`;
}) =>
  await rolesMod
    .connect(getMemberWallet())
    .callStatic.execTransactionWithRole(
      to,
      value || 0,
      data || "0x",
      0,
      testRoleKey,
      false,
    );

const derivePermissions = (entries: PresetAllowEntry[]) => {
  const permissions = fillPreset({
    allow: entries,
    placeholders: {},
    chainId: 1, // This won't be used (presets only set this field for informational purposes)
  });
  checkPermissionsIntegrity(permissions);
  return permissions;
};
