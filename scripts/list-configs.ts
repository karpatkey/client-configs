#!/usr/bin/env ts-node
import { discoverAvailableConfigs } from "./discover"

function main() {
  const configs = discoverAvailableConfigs()

  console.log("📋 Available Client Configurations\n")

  if (configs.clients.length === 0) {
    console.log("No clients found.")
    return
  }

  for (const client of configs.clients) {
    console.log(`\n📦 ${client}`)

    // Get all accounts for this client
    const clientAccounts = Object.keys(configs.accounts).filter((key) =>
      key.startsWith(client + "/")
    )

    if (clientAccounts.length === 0) {
      console.log("  (no accounts)")
      continue
    }

    for (const accountKey of clientAccounts.sort()) {
      const accountName = accountKey.split("/")[1]
      console.log(`\n  🌐 ${accountName}`)

      // List instances
      const instances = configs.instances[accountKey] || []
      if (instances.length > 0) {
        console.log(`    Instances:`)
        instances.forEach((instance) => {
          console.log(`      • ${instance}`)
        })
      }

      // List roles
      const roles = configs.roles[accountKey] || []
      if (roles.length > 0) {
        console.log(`    Roles:`)
        roles.forEach((role) => {
          console.log(`      • ${role}`)
        })
      }

      // Show usage example
      if (instances.length > 0 && roles.length > 0) {
        const exampleInstance = instances[0]
        const exampleRole = roles[0]
        console.log(
          `    Example: yarn apply ${client} ${accountName}/${exampleInstance} ${exampleRole}`
        )
      }
    }
  }

  console.log("\n" + "=".repeat(60))
  console.log("\n💡 Usage:")
  console.log("  yarn apply <client> <account(/instance)> <role>")
  console.log("\n📖 Examples:")
  console.log("  yarn apply gnosis-dao/illiquid-assets mainnet/main MANAGER")
  console.log("  yarn apply balancer-dao mainnet/test MANAGER")
  console.log("  yarn apply gnosis-dao mainnet MANAGER")
}

main()
