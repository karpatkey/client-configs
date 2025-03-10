import type { Permission, PermissionSet } from "zodiac-roles-sdk"

type Parameters = {
  [key: string]: string
}

export type PermissionList = (
  | Permission
  | PermissionSet
  | Promise<PermissionSet>
)[]

export type ChainId = 1 | 10 | 100 | 8453 | 42161

export interface Instance {
  rolesMod: `0x${string}`
  chainId: ChainId
  roleKeyPrefix?: string
  parameters?: Parameters
}

export enum Chain {
  eth = 1,
  oeth = 10,
  gno = 100,
  base = 8453,
  arb1 = 42161,
}
