import type { Permission, PermissionSet } from "zodiac-roles-sdk";

export interface Role {
  roleKey: `0x${string}`;
  permissions: (Permission | PermissionSet | Promise<PermissionSet>)[]
  members: `0x${string}`[];
}

export interface Client {
  avatar: `0x${string}`;
  rolesMod: `0x${string}`;
  chainId: 1 | 100;
  roles: {
    [key: string]: Role;
  };
}

export type PermissionList = (Permission | PermissionSet | Promise<PermissionSet>)[]
