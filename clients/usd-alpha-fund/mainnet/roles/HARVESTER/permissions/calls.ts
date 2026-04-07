import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"

export default () =>
  [
    // Merkl - Claim rewards from Angle Distributor
    allow.mainnet.merkl.angleDistributor.claim(),
  ] satisfies PermissionList
