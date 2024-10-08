import type { Permission, PermissionSet } from "zodiac-roles-sdk"

export interface Role {
  roleKey: string
  permissions: (Permission | PermissionSet | Promise<PermissionSet>)[]
  members: `0x${string}`[]
}

export type ChainId = 1 | 10 | 100 | 8453 | 42161

export interface Client {
  avatar: `0x${string}`
  rolesMod: `0x${string}`
  chainId: ChainId
  roles: {
    [key: string]: Role
  }
}

export type PermissionList = (
  | Permission
  | PermissionSet
  | Promise<PermissionSet>
)[]

export enum Chain {
  eth = "eth",
  oeth = "oeth",
  gno = "gno",
  base = "base",
  arb1 = "arb1",
}
