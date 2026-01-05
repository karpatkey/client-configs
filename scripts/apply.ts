#!/usr/bin/env ts-node
import yargs from "yargs"
import { Annotation, Target } from "zodiac-roles-sdk"
import { compileApplyData } from "../helpers/apply"

const ZODIAC_ROLES_APP = "https://roles.gnosisguild.org"

const CHAIN_PREFIX = {
  1: "eth",
  10: "oeth",
  100: "gno",
  8453: "base",
  42161: "arb1",
}

/**
 * Posts permission to Zodiac Roles app for storage
 * @returns The hash under which permissions have been stored
 */
const postPermissions = async ({
  targets,
  annotations,
}: {
  targets: Target[]
  annotations: Annotation[]
}) => {
  const res = await fetch(`${ZODIAC_ROLES_APP}/api/permissions`, {
    method: "POST",
    body: JSON.stringify({ targets, annotations }),
  })
  const json = (await res.json()) as any
  const { hash } = json
  if (!hash) {
    console.error(json)
    throw new Error("Failed to post permissions")
  }
  return hash
}

async function main() {
  const args = await yargs(process.argv.slice(2))
    .usage("$0 <client> <account(/instance)> <role>")
    .positional("client", { demandOption: true, type: "string" })
    .positional("account", {
      demandOption: true,
      type: "string",
      coerce: (value) => {
        if (!value) return "main/main"
        return value.includes("/") ? value : `${value}/main`
      },
    })
    .positional("role", { demandOption: true, type: "string" })
    .help().argv

  // yargs positional arguments can be accessed as properties or via args._
  // If accessed via properties, coerce function has already run
  // If accessed via args._, we need to apply coerce logic manually
  const clientArg = (args.client as string) || (args._[0] as string)
  let accountArg: string | undefined

  if (args.account) {
    // Already coerced by yargs
    accountArg = args.account as string
  } else if (args._[1]) {
    // Need to apply coerce logic manually
    const accountArgRaw = args._[1] as string
    accountArg = accountArgRaw.includes("/")
      ? accountArgRaw
      : `${accountArgRaw}/main`
  }

  const roleArg = (args.role as string) || (args._[2] as string)

  if (!clientArg || !accountArg || !roleArg) {
    console.error("Error: Missing required arguments")
    console.error("\nUsage: yarn apply <client> <account(/instance)> <role>")
    console.error("\nExamples:")
    console.error(
      "  yarn apply gnosis-dao/illiquid-assets mainnet/main MANAGER"
    )
    console.error("  yarn apply balancer-dao mainnet/test MANAGER")
    console.error("  yarn apply gnosis-dao mainnet MANAGER")
    process.exit(1)
  }

  try {
    const { targets, annotations, members, instance, roleKey } =
      await compileApplyData({
        clientArg,
        accountArg,
        roleArg,
      })

    const hash = await postPermissions({ targets, annotations })

    const permissionsPage = `${ZODIAC_ROLES_APP}/permissions/${CHAIN_PREFIX[instance.chainId]}/${hash}`
    console.log(`Permissions page: ${permissionsPage}`)

    const diffUrl = `${ZODIAC_ROLES_APP}/${CHAIN_PREFIX[instance.chainId]}:${instance.rolesMod}/roles/${roleKey}/diff/${hash}`
    console.log(`Permissions diff page: ${diffUrl}`)
  } catch (error: any) {
    console.error("\n❌ Error:", error.message)
    if (
      error.message.includes("Available") ||
      error.message.includes("not found")
    ) {
      console.error(
        "\n💡 Tip: Use the suggestions above to find the correct client, account, instance, or role."
      )
    }
    process.exit(1)
  }
}

main()
