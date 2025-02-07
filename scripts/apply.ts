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
    .usage("$0 <client> <chain> <instance> <role>")
    .positional("client", { demandOption: true, type: "string" })
    .positional("chain", { demandOption: true, type: "string" })
    .positional("instance", { demandOption: true, type: "string" })
    .positional("role", { demandOption: true, type: "string" }).argv

  const [clientArg, chainArg, instanceArg, roleArg] = args._ as [
    string,
    string,
    string,
    string,
  ]

  const { targets, annotations, instance, chainId, role } =
    await compileApplyData({
      clientArg,
      chainArg,
      instanceArg,
      roleArg,
    })

  const hash = await postPermissions({ targets, annotations })

  const permissionsPage = `${ZODIAC_ROLES_APP}/permissions/${CHAIN_PREFIX[chainId]}/${hash}`
  console.log(`Permissions page: ${permissionsPage}`)

  const diffUrl = `${ZODIAC_ROLES_APP}/${CHAIN_PREFIX[chainId]}:${instance.rolesMod}/roles/${role.roleKey}/diff/${hash}`
  console.log(`Permissions diff page: ${diffUrl}`)
}

main()
