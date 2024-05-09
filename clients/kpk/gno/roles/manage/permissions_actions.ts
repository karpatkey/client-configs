import { PermissionList } from "../../../../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { contracts } from "../../../../../eth-sdk/config"
import {
  sDAI
} from "../../../../../eth-sdk/addresses_gno"

export default [
  /*********************************************
  * Typed-presets permissions
  *********************************************/
  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // Agave - sDAI
  // Deposit XDAI
  allow.gnosis.agave.SavingsXDaiAdapter.depositXDAI(
    c.avatar,
    {
      send: true
    }
  ),
  // Withdraw XDAI
  ...allowErc20Approve([sDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.redeemXDAI(
    undefined,
    c.avatar
  ),

  // Agave - sDAI - Deposit and Withdraw WXDAI
  ...allowErc20Approve([contracts.gnosis.wxdai], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.deposit(
    undefined,
    c.avatar
  ),
  // Withdraw WXDAI
  // sDAI approval with SavingsXDaiAdapter as spender already whitelisted
  allow.gnosis.agave.SavingsXDaiAdapter.redeem(
    undefined,
    c.avatar
  )
] satisfies PermissionList