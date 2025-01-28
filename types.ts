import type { Permission, PermissionSet } from "zodiac-roles-sdk"

type Parameters = {
  [key: string]: string
}

export type PermissionList = (
  | Permission
  | PermissionSet
  | Promise<PermissionSet>
)[]

export interface Role<T extends Parameters = Parameters> {
  roleKey: string
  permissions: {
    allowedActions: PermissionList
    allowedCalls: PermissionList | ((parameters: T) => PermissionList)
  }
  members: `0x${string}`[]
}

export type ChainId = 1 | 10 | 100 | 8453 | 42161

interface Instance {
  rolesMod: `0x${string}`
  parameters?: Parameters
}
export interface Client {
  chainId: ChainId
  roles: {
    [key: string]: Role
  }
  instances: {
    [key: string]: Instance
  }
}

export enum Chain {
  eth = 1,
  oeth = 10,
  gno = 100,
  base = 8453,
  arb1 = 42161,
}
