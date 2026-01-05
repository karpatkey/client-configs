import {
  targetIntegrity,
  Permission,
  PermissionSet,
  processPermissions,
} from "zodiac-roles-sdk"
import type { Instance, PermissionList } from "@/types"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import {
  discoverAvailableConfigs,
  formatAvailableConfigs,
} from "../scripts/discover"

export const preprocessPermissions = async <P extends { [key: string]: any }>(
  permissions: {
    allowedActions: PermissionList | ((parameters: P) => PermissionList)
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

  let actionPermissions: PermissionList
  if (typeof permissions.allowedActions === "function") {
    actionPermissions = permissions.allowedActions(parameters || ({} as any))
  } else {
    actionPermissions = permissions.allowedActions
  }

  return await Promise.all([...actionPermissions, ...callPermissions])
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
  // Validate inputs
  if (!clientArg) {
    throw new Error(
      `Missing required argument: client\n\n${formatAvailableConfigs()}`
    )
  }

  if (!accountArg) {
    throw new Error(
      `Missing required argument: account\n\n${formatAvailableConfigs(clientArg)}`
    )
  }

  if (!roleArg) {
    throw new Error(
      `Missing required argument: role\n\n${formatAvailableConfigs(clientArg, accountArg)}`
    )
  }

  // Parse account/instance
  const accountParts = accountArg.split("/")
  if (
    accountParts.length > 2 ||
    accountParts.length === 0 ||
    !accountParts[0]
  ) {
    throw new Error(
      `Invalid account format: "${accountArg}". Expected format: <account> or <account>/<instance>\n\n${formatAvailableConfigs(clientArg)}`
    )
  }

  const accountName = accountParts[0]
  const instanceName = accountParts[1] || "main"

  // Validate paths exist before attempting imports
  const clientsDir = path.join(__dirname, "../clients")
  const clientPath = path.join(clientsDir, clientArg)
  const accountPath = path.join(clientPath, accountName)
  const instancePath = path.join(accountPath, "instances", `${instanceName}.ts`)
  const rolePath = path.join(accountPath, "roles", roleArg)

  if (!fs.existsSync(clientPath)) {
    throw new Error(
      `Client "${clientArg}" not found.\n\n${formatAvailableConfigs()}`
    )
  }

  if (!fs.existsSync(accountPath)) {
    throw new Error(
      `Account "${accountName}" not found for client "${clientArg}".\n\n${formatAvailableConfigs(clientArg)}`
    )
  }

  if (!fs.existsSync(instancePath)) {
    const availableInstances =
      discoverAvailableConfigs().instances[`${clientArg}/${accountName}`] || []
    throw new Error(
      `Instance "${instanceName}" not found for "${clientArg}/${accountName}".\n\nAvailable instances:\n${availableInstances.map((i) => `  - ${i}`).join("\n")}`
    )
  }

  if (!fs.existsSync(rolePath)) {
    const availableRoles =
      discoverAvailableConfigs().roles[`${clientArg}/${accountName}`] || []
    throw new Error(
      `Role "${roleArg}" not found for "${clientArg}/${accountName}".\n\nAvailable roles:\n${availableRoles.map((r) => `  - ${r}`).join("\n")}`
    )
  }

  // Import instance
  let instance: Instance
  try {
    instance = (await import(pathToFileURL(instancePath).href)) as Instance
  } catch (error: any) {
    throw new Error(
      `Failed to import instance "${instanceName}" from "${clientArg}/${accountName}": ${error.message}`
    )
  }

  // Import role members
  let members: `0x${string}`[]
  try {
    members = (
      await import(pathToFileURL(path.join(rolePath, "members.ts")).href)
    ).default as `0x${string}`[]
  } catch (error: any) {
    throw new Error(
      `Failed to import members for role "${roleArg}": ${error.message}`
    )
  }

  // Import permissions
  let allowedActions: PermissionList
  try {
    allowedActions = (
      await import(
        pathToFileURL(path.join(rolePath, "permissions", "_actions.ts")).href
      )
    ).default
  } catch (error: any) {
    throw new Error(
      `Failed to import actions for role "${roleArg}": ${error.message}`
    )
  }

  let allowedCalls: PermissionList | ((parameters: any) => PermissionList)
  try {
    allowedCalls = (
      await import(
        pathToFileURL(path.join(rolePath, "permissions", "calls.ts")).href
      )
    ).default
  } catch (error: any) {
    throw new Error(
      `Failed to import calls for role "${roleArg}": ${error.message}`
    )
  }

  const { targets, annotations } = processPermissions(
    await preprocessPermissions(
      { allowedActions, allowedCalls },
      instance.parameters
    )
  )
  targetIntegrity(targets)

  const roleKeyPrefix = instance.roleKeyPrefix || ""
  const roleKey = roleKeyPrefix + roleArg

  return { targets, annotations, members, roleKey, instance }
}
