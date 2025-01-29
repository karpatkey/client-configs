import type { Permission, PermissionSet } from "zodiac-roles-sdk"

export interface Role {
  roleKey: string
  permissions: (Permission | PermissionSet | Promise<PermissionSet>)[]
  members: `0x${string}`[]
}

export type ChainId = 1 | 10 | 100 | 8453 | 42161

export interface Client {
  chainId: ChainId
  roles: {
    [key: string]: Role
  }
  mods: {
    [key: string]: `0x${string}`
  }
}

export type PermissionList = (
  | Permission
  | PermissionSet
  | Promise<PermissionSet>
)[]

export enum Chain {
  eth = 1,
  oeth = 10,
  gno = 100,
  base = 8453,
  arb1 = 42161,
}
