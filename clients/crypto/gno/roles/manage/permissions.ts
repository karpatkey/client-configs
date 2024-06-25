import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  WXDAI,
  sDAI,
  USDC,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Cowswap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [COMP, sDAI, USDC, WXDAI],
    buy: [E_ADDRESS, sDAI, USDC, WXDAI],
  }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // Agave - sDAI
  // Deposit XDAI
  allow.gnosis.agave.SavingsXDaiAdapter.depositXDAI(c.avatar, {
    send: true,
  }),
  // Withdraw XDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.redeemXDAI(undefined, c.avatar),

  // Agave - sDAI - Deposit and Withdraw WXDAI
  ...allowErc20Approve([WXDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.deposit(undefined, c.avatar),
  // Withdraw WXDAI
  // sDAI approval with SavingsXDaiAdapter as spender already whitelisted
  allow.gnosis.agave.SavingsXDaiAdapter.redeem(undefined, c.avatar),

  // Curve - 3pool - Swap WXDAI <-> USDC
  ...allowErc20Approve([USDC, WXDAI], [contracts.gnosis.curve.x3CRV_pool]),
  allow.gnosis.curve.x3CRV_pool.exchange(
    c.or(0, 1), // 0 = WXDAI, 1 = USDC
    c.or(0, 1)
  ),
] satisfies PermissionList
