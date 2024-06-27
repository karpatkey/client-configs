import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  WXDAI,
  sDAI,
  USDC,
  USDCe,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar as avatar_eth } from "../../../eth/index"

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

  // Balancer - USDT/sDAI/USDC pool - Swap sDAI <-> USDC
  ...allowErc20Approve([USDC, WXDAI], [contracts.mainnet.balancer.vault]),
  // Swap sDAI for USDC
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
      assetIn: sDAI,
      assetOut: USDC,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),
  // Swap USDC for sDAI
  allow.mainnet.balancer.vault.swap(
    {
      poolId:
        "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
      assetIn: USDC,
      assetOut: sDAI,
    },
    {
      recipient: c.avatar,
      sender: c.avatar,
    }
  ),

  // Swap USDC.e -> USDC
  ...allowErc20Approve([USDCe], [contracts.gnosis.usdc_transmuter]),
  allow.gnosis.usdc_transmuter.withdraw(),

  // Bridge - Gnosis -> Mainnet
  // XDAI -> DAI
  allow.gnosis.xdai_bridge_2.relayTokens(avatar_eth),
  // COMP (Gnosis) -> COMP (Mainnet)
  allow.gnosis.comp.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    avatar_eth
  ),
  // USDC (Gnosis) -> USDC (Mainnet)
  allow.gnosis.usdc.transferAndCall(
    contracts.gnosis.xdai_bridge,
    undefined,
    avatar_eth
  ),
] satisfies PermissionList
