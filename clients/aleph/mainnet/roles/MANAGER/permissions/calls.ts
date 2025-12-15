import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { WETH, wstETH, gearbox } from "@/addresses/eth"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Gearbox - ETH v3 - Curator: kpk
    allowErc20Approve([WETH], [gearbox.kpkWeth]),
    {
      ...allow.mainnet.gearbox.poolV3.deposit(undefined, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },
    // This is the function called by the UI
    {
      ...allow.mainnet.gearbox.poolV3.depositWithReferral(undefined, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },
    {
      ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },

    // Gearbox - wstETH v3 - Curator: kpk
    allowErc20Approve([wstETH], [gearbox.kpkWstEth]),
    {
      ...allow.mainnet.gearbox.poolV3.deposit(undefined, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },
    // This is the function called by the UI
    {
      ...allow.mainnet.gearbox.poolV3.depositWithReferral(undefined, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },
    {
      ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },

    // Merkl - Rewards
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
