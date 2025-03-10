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
      coerce: (value) => (value.includes("/") ? value : value + "/main"),
    })
    .positional("role", { demandOption: true, type: "string" }).argv

  const [clientArg, accountArg, roleArg] = args._ as [string, string, string]

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
}

main()
