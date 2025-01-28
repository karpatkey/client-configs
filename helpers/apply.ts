import { checkIntegrity, processPermissions } from "zodiac-roles-sdk"
import type { Client, PermissionList } from "@/types"

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

  let callPermissions: PermissionList
  if (typeof role.permissions.allowedCalls === "function") {
    // handle parametrized permissions
    callPermissions = role.permissions.allowedCalls(instance.parameters || {})
  } else {
    callPermissions = role.permissions.allowedCalls
  }

  const awaitedPermissions = await Promise.all([
    ...role.permissions.allowedActions,
    ...callPermissions,
  ])
  const { targets, annotations } = processPermissions(awaitedPermissions)
  checkIntegrity(targets)

  return { targets, annotations, role, instance, chainId }
}
