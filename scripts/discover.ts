import fs from "node:fs"
import path from "node:path"

/**
 * Discovers available configs from the clients directory structure
 */
export const discoverAvailableConfigs = () => {
  const clientsDir = path.join(__dirname, "../clients")
  const configs: {
    clients: string[]
    accounts: Record<string, string[]>
    instances: Record<string, string[]>
    roles: Record<string, string[]>
  } = {
    clients: [],
    accounts: {},
    instances: {},
    roles: {},
  }

  if (!fs.existsSync(clientsDir)) {
    return configs
  }

  const clients = fs
    .readdirSync(clientsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  configs.clients = clients.sort()

  for (const client of clients) {
    const clientPath = path.join(clientsDir, client)
    const accounts = fs
      .readdirSync(clientPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const account of accounts) {
      const accountKey = `${client}/${account}`
      configs.accounts[accountKey] = []

      const accountPath = path.join(clientPath, account)
      const instancesPath = path.join(accountPath, "instances")

      if (fs.existsSync(instancesPath)) {
        const instances = fs
          .readdirSync(instancesPath, { withFileTypes: true })
          .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".ts"))
          .map((dirent) => dirent.name.replace(/\.ts$/, ""))
        configs.instances[accountKey] = instances.sort()
      }

      const rolesPath = path.join(accountPath, "roles")
      if (fs.existsSync(rolesPath)) {
        const roles = fs
          .readdirSync(rolesPath, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name)
        configs.roles[accountKey] = roles.sort()
      }
    }
  }

  return configs
}

/**
 * Formats available configs into a helpful error message
 */
export const formatAvailableConfigs = (
  clientArg?: string,
  accountArg?: string
): string => {
  const configs = discoverAvailableConfigs()
  const lines: string[] = []

  if (!clientArg) {
    lines.push("Available clients:")
    configs.clients.forEach((client) => {
      lines.push(`  - ${client}`)
    })
    return lines.join("\n")
  }

  const matchingAccounts = Object.keys(configs.accounts).filter((key) =>
    key.startsWith(clientArg + "/")
  )

  if (matchingAccounts.length === 0) {
    lines.push(`No accounts found for client "${clientArg}"`)
    lines.push("\nAvailable clients:")
    configs.clients.forEach((client) => {
      lines.push(`  - ${client}`)
    })
    return lines.join("\n")
  }

  if (!accountArg) {
    lines.push(`Available accounts for client "${clientArg}":`)
    matchingAccounts.forEach((accountKey) => {
      const accountName = accountKey.split("/")[1]
      lines.push(`  - ${accountName}`)
    })
    return lines.join("\n")
  }

  const accountKey = `${clientArg}/${accountArg.split("/")[0]}`
  const instances = configs.instances[accountKey] || []
  const roles = configs.roles[accountKey] || []

  if (instances.length > 0) {
    lines.push(
      `Available instances for "${clientArg}/${accountArg.split("/")[0]}":`
    )
    instances.forEach((instance) => {
      lines.push(`  - ${instance}`)
    })
  }

  if (roles.length > 0) {
    lines.push(
      `\nAvailable roles for "${clientArg}/${accountArg.split("/")[0]}":`
    )
    roles.forEach((role) => {
      lines.push(`  - ${role}`)
    })
  }

  return lines.join("\n")
}
