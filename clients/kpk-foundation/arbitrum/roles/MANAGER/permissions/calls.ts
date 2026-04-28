import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/kit"
import { RPL, USDC, morpho } from "@/addresses/arb1"
import { c } from "zodiac-roles-sdk"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.arbitrumOne.weth.withdraw(),
    allow.arbitrumOne.weth.deposit({
      send: true,
    }),

    // Merkl - Rewards
    allow.arbitrumOne.merkl.angleDistributor.claim(
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

    // Morpho Market - Withdraw USDC/RPL - id: 0xc7670063349ac19dfa324ead7bd7da2985ae931e1b09fb0e31b62c6486b730bd
    allow.arbitrumOne.morpho.morphoBlue.withdraw(
      {
        loanToken: USDC,
        collateralToken: RPL,
        oracle: morpho.oracleUsdcRpl,
        irm: morpho.adaptativeCurveIrm,
        lltv: "860000000000000000",
      },
      undefined,
      undefined,
      c.avatar,
      c.avatar
    ),
  ] satisfies PermissionList
