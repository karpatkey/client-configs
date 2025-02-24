import {
  checkIntegrity,
  Permission,
  PermissionSet,
  processPermissions,
} from "zodiac-roles-sdk"
import type { Instance, PermissionList } from "@/types"

export const preprocessPermissions = async <P extends { [key: string]: any }>(
  permissions: {
    allowedActions: PermissionList
    allowedCalls: PermissionList | ((parameters: P) => PermissionList)
  },
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
  accountArg,
  roleArg,
}: {
  clientArg: string
  accountArg: string
  roleArg: string
}) => {
  const [accountName, instanceName] = accountArg.split("/")

  const instance = (await import(
    `../clients/${clientArg}/${accountName}/instances/${instanceName}`
  )) as Instance

  const rolePath = `../clients/${clientArg}/${accountName}/roles/${roleArg}`
  const members = (await import(`${rolePath}/members`)) as `0x${string}`[]

  let allowedActions: PermissionList = []
  try {
    allowedActions = await import(`${rolePath}/permissions/_actions`)
  } catch {
    // ignore
  }

  let allowedCalls:
    | PermissionList
    | ((parameters: { [key: string]: any }) => PermissionList) = []
  try {
    allowedCalls = await import(`${rolePath}/permissions/calls`)
  } catch {
    // ignore
  }

  const { targets, annotations } = processPermissions(
    await preprocessPermissions(
      { allowedActions, allowedCalls },
      instance.parameters
    )
  )
  checkIntegrity(targets)

  const roleKeyPrefix = instance.roleKeyPrefix || ""
  const roleKey = roleKeyPrefix + roleArg

  return { targets, annotations, members, roleKey, instance }
}
