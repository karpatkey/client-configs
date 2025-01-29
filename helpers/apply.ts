import { checkIntegrity, processPermissions } from "zodiac-roles-sdk"
import type { Client, PermissionList } from "../types"

export const compileApplyData = async ({
  clientArg,
  chainArg,
  instanceArg,
  roleArg,
}: {
  clientArg: string
  chainArg: string
  instanceArg: string
  roleArg: string
}) => {
  const { instances, roles, chainId } = (await import(
    `../clients/${clientArg}/${chainArg}`
  )) as Client

  const instance = instances[instanceArg]
  if (!instance) {
    throw new Error(
      `There is no Roles instance labeled '${instanceArg}' for client ${clientArg}, available instances: ${Object.keys(instances).join(", ")}`
    )
  }

  const role = roles[roleArg]
  if (!role) {
    throw new Error(
      `There is no '${roleArg}' role for client ${clientArg}, available roles: ${Object.keys(roles).join(", ")}`
    )
  }

  let permissionList: PermissionList
  if (typeof role.permissions === "function") {
    // handle parametrized permissions
    permissionList = role.permissions(instance.parameters || {})
  } else {
    permissionList = role.permissions
  }

  const awaitedPermissions = await Promise.all(permissionList)
  const { targets, annotations } = processPermissions(awaitedPermissions)
  checkIntegrity(targets)

  return { targets, annotations, role, instance, chainId }
}
