import {
  checkIntegrity,
  Permission,
  PermissionSet,
  processPermissions,
} from "zodiac-roles-sdk"
import type { Client, PermissionList, Role } from "@/types"

export const preprocessPermissions = async <P extends {}>(
  permissions: Role<P>["permissions"],
  parameters?: P
): Promise<(Permission | PermissionSet)[]> => {
  let callPermissions: PermissionList
  if (typeof permissions.allowedCalls === "function") {
    // handle parametrized permissions
    callPermissions = permissions.allowedCalls(parameters || ({} as any))
  } else {
    callPermissions = permissions.allowedCalls
  }

  return await Promise.all([...permissions.allowedActions, ...callPermissions])
}

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

  const { targets, annotations } = processPermissions(
    await preprocessPermissions(role.permissions, instance.parameters)
  )
  checkIntegrity(targets)

  return { targets, annotations, role, instance, chainId }
}
