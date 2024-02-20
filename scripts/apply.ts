#!/usr/bin/env ts-node
import yargs from "yargs/yargs";
import { Permission, PermissionSet, checkIntegrity, processPermissions } from "zodiac-roles-sdk";
import { Client } from "../types";

const ZODIAC_ROLES_APP = "https://zodiac-roles-app.vercel.app";

const CHAIN_PREFIX = {
  1: 'eth',
  100: 'gno'
}

/** 
 * Posts permission to Zodiac Roles app for storage
 * @returns The hash under which permissions have been stored
*/
const postPermissions = async (permissions: (Permission | PermissionSet | Promise<PermissionSet>)[]) => {
  const awaitedPermissions = await Promise.all(permissions)
  const { targets, annotations } = processPermissions(awaitedPermissions)
  checkIntegrity(targets)
  
  const res = await fetch(`${ZODIAC_ROLES_APP}/api/permissions`, {
    method: "POST",
    body: JSON.stringify({ targets, annotations }),
  });
  const json = await res.json();
  const { hash } = json;
  if (!hash) throw new Error("Failed to post permissions", json);
  return hash
};

const args = await yargs(process.argv.slice(2))
  .usage("$0 <client> <role>")
  .positional("client", { demandOption: true, type: "string" })
  .positional("role", { demandOption: true, type: "string" }).argv;

const { avatar, rolesMod, chainId, roles } = (await import(`../clients/${args.client}/index.ts`)) as Client;

const role = roles[args.role]
if(!role) {
  throw new Error(`There is no '${args.role}' role for client ${args.client}`)
}

const hash = await postPermissions(role.permissions)
const diffUrl = `${ZODIAC_ROLES_APP}/${CHAIN_PREFIX[chainId]}:${rolesMod}/roles/${role.roleKey}/diff/${hash}`

console.log(`Permission diff page: ${diffUrl}`)