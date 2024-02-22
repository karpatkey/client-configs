import {
  applyTargets,
  checkIntegrity,
  processPermissions,
} from "zodiac-roles-sdk"
import { Roles__factory } from "./rolesModTypechain"
import {
  ROLES_ADDRESS,
  getAvatarWallet,
  getMemberWallet,
  getOwnerWallet,
} from "./accounts"
import { Interface, formatBytes32String } from "ethers/lib/utils"
import { BigNumberish, Contract, Overrides } from "ethers"
import { getProvider } from "./provider"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { PermissionList } from "../types"

const owner = getOwnerWallet()

export const rolesMod = Roles__factory.connect(ROLES_ADDRESS, owner)
export const testRoleKey = formatBytes32String("TEST-ROLE")

export const configurePermissions = async (permissions: PermissionList) => {
  const { targets } = processPermissions(await Promise.all(permissions))
  checkIntegrity(targets)

  const calls = await applyTargets(testRoleKey, targets, {
    address: rolesMod.address,
    currentTargets: [],
    mode: "replace",
    log: console.debug,
  })

  console.log(`Applying permissions with ${calls.length} calls`)
  let nonce = await owner.getTransactionCount()
  await Promise.all(
    calls.map(
      async (call) =>
        await owner.sendTransaction({
          to: rolesMod.address,
          data: call,
          nonce: nonce++,
        })
    )
  )
  console.log("Permissions applied")
}

export const execThroughRole = async (
  {
    to,
    data,
    value,
    operation = 0,
  }: {
    to: `0x${string}`
    data?: `0x${string}`
    value?: `0x${string}`
    operation?: 0 | 1
  },
  overrides?: Overrides
) =>
  await rolesMod
    .connect(getMemberWallet())
    .execTransactionWithRole(
      to,
      value || 0,
      data || "0x",
      operation,
      testRoleKey,
      true,
      overrides
    )

export const callThroughRole = async ({
  to,
  data,
  value,
  operation = 0,
}: {
  to: `0x${string}`
  data?: `0x${string}`
  value?: `0x${string}`
  operation?: 0 | 1
}) =>
  await rolesMod
    .connect(getMemberWallet())
    .callStatic.execTransactionWithRole(
      to,
      value || 0,
      data || "0x",
      operation,
      testRoleKey,
      false
    )

const erc20Interface = new Interface([
  "function transfer(address to, uint amount) returns (bool)",
])

export const wrapEth = async (value: BigNumberish) => {
  await getMainnetSdk(getAvatarWallet()).weth.deposit({ value })
}

export const stealErc20 = async (
  token: `0x${string}`,
  amount: BigNumberish,
  from: `0x${string}`
) => {
  // Impersonate the token holder
  const provider = getProvider()
  await provider.send("anvil_impersonateAccount", [from])

  // Get the token contract with impersonated signer
  const contract = new Contract(
    token,
    erc20Interface,
    await provider.getSigner(from)
  )

  // Transfer the requested amount to the avatar
  await contract.transfer(getAvatarWallet().address, amount)

  // Stop impersonating
  await provider.send("anvil_stopImpersonatingAccount", [from])
}
