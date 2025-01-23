import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import { COMP, DAI, sDAI, USDC } from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  // CowSwap - [COMP, DAI, sDAI, USDC] -> [DAI, sDAI, USDC]
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),

  // Curve - DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.x3CrvPool]),
  allow.mainnet.curve.x3CrvPool.exchange(
    c.or(0, 1), // 0 = DAI, 1 = USDC
    c.or(0, 1)
  ),
] satisfies PermissionList
