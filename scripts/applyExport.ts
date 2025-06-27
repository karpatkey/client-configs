#!/usr/bin/env ts-node
import yargs from "yargs"
import fs from "node:fs"
import path from "node:path"
import {
  ChainId,
  Clearance,
  Target,
  planApplyRole,
  posterAbi,
  rolesAbi,
} from "zodiac-roles-sdk"
import {
  hexlify,
  Interface,
  isBytesLike,
  JsonFragment,
  JsonFragmentType,
  ParamType,
  Result,
} from "ethers"
import { encodeBytes32String } from "defi-kit"
import { compileApplyData } from "../helpers/apply"

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

  const encodedRoleKey = encodeBytes32String(roleKey)

  const calls = await planApplyRole(
    {
      key: encodedRoleKey,
      targets,
      annotations,
    },
    { chainId: instance.chainId, address: instance.rolesMod }
  )

  const txBuilderJson = exportToSafeTransactionBuilder(
    calls,
    instance.chainId,
    roleKey
  )

  const exportDir = path.join(__dirname, "../export")
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir)
  }

  const filePath = path.join(
    exportDir,
    `${clientArg}_${accountArg.replace(/\//g, "-")}_${roleArg}.json`
  )
  fs.writeFileSync(filePath, JSON.stringify(txBuilderJson, null, 2))

  console.log(`Transaction Builder JSON exported to: ${filePath}`)
}

main()

const exportToSafeTransactionBuilder = (
  calls: { to: `0x${string}`; data: `0x${string}` }[],
  chainId: ChainId,
  role: string
) => {
  return {
    version: "1.0",
    chainId: chainId.toString(10),
    createdAt: Date.now(),
    meta: {
      name: `Update permissions of "${role}" role`,
      description: "",
      txBuilderVersion: "1.16.2",
    },
    transactions: calls.map(decode),
  } as const
}

const decode = (transaction: { to: `0x${string}`; data: `0x${string}` }) => {
  const abi: readonly JsonFragment[] =
    transaction.to === POSTER_ADDRESS ? posterAbi : rolesAbi

  const iface = new Interface(abi)

  const selector = transaction.data.slice(0, 10)
  const functionFragment = iface.getFunction(selector)

  if (!functionFragment) {
    throw new Error(`Could not find a function with selector ${selector}`)
  }

  const contractMethod = abi.find(
    (fragment) =>
      fragment.type === "function" && fragment.name === functionFragment.name
  )
  if (!contractMethod) {
    throw new Error(
      `Could not find an ABI function fragment with name ${functionFragment.name}`
    )
  }

  const contractInputsValues = asTxBuilderInputValues(
    iface.decodeFunctionData(functionFragment, transaction.data),
    functionFragment.inputs
  )

  return {
    to: transaction.to,
    value: "0",
    contractMethod: {
      inputs: mapInputs(contractMethod.inputs) || [],
      name: contractMethod.name || "",
      payable: !!contractMethod.payable,
    },
    contractInputsValues,
  }
}

const mapInputs = (
  inputs: readonly JsonFragmentType[] | undefined
): ContractInput[] | undefined => {
  return inputs?.map((input) => ({
    internalType: input.internalType || "",
    name: input.name || "",
    type: input.type || "",
    components: mapInputs(input.components),
  }))
}

const asTxBuilderInputValues = (
  result: Result,
  params: readonly ParamType[]
) => {
  const object: Record<string, string> = {}

  for (const param of params) {
    const value = result[param.name]
    let serialized = value
    if (typeof value === "string") {
      serialized = value
    } else if (typeof value === "bigint" || typeof value === "number") {
      serialized = value.toString()
    } else if (isBytesLike(value)) {
      serialized = hexlify(value)
    } else if (value instanceof Result) {
      serialized = JSON.stringify(value, (_, v) =>
        isBytesLike(v) ? hexlify(v) : typeof v === "bigint" ? v.toString() : v
      )
    } else {
      throw new Error(`Unexpected value type: ${typeof value}`)
    }

    object[param.name] = serialized
  }
  return object
}

export interface ContractInput {
  internalType: string
  name: string
  type: string
  components?: ContractInput[]
}

const isEmptyFunctionScoped = (target: Target) =>
  target.clearance === Clearance.Function && target.functions.length === 0

// EIP-3722 Poster contract
const POSTER_ADDRESS = "0x000000000000cd17345801aa8147b8D3950260FF" as const
