import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Merkl - Claim incentives accrued by the kpk USDC Yield RWA vault position and the
    // Aave v4 Prime Hub USDC borrow rebate. Claim-only: rewards land in the avatar Safe
    // and any redeployment is a separate, MANAGER-gated action. `users` is pinned to the
    // avatar Safe so the role can never claim to a third party; `tokens`/`amounts`/`proofs`
    // stay open because the merkle proof binds them. One `c.or` branch per array length:
    // arity == number of reward tokens settled in a single claim (this fund already needs 2).
    allow.mainnet.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
    ),
  ] satisfies PermissionList
