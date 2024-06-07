import { PermissionList } from "../../../../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { contracts } from "../../../../../eth-sdk/config"
import { CRV, USDC, USDT, sDAI, WETH, wstETH, WXDAI, E_ADDRESS } from "../../../../../eth-sdk/addresses_gno"

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
  ...allowErc20Approve([WXDAI], [contracts.gnosis.agave.SavingsXDaiAdapter]),
  allow.gnosis.agave.SavingsXDaiAdapter.deposit(
    undefined,
    c.avatar
  ),
  // Withdraw WXDAI
  // sDAI approval with SavingsXDaiAdapter as spender already whitelisted
  allow.gnosis.agave.SavingsXDaiAdapter.redeem(
    undefined,
    c.avatar
  ),

  // CowSwap - Holdings
  ...allowErc20Approve([CRV, USDC, USDT, sDAI, wstETH, WXDAI], [contracts.gnosis.cowswap.gpv2_vault_relayer]),
  allow.gnosis.cowswap.order_signer.signOrder(
    {
      sellToken: c.or(
        USDC, USDT, sDAI
      ),
      buyToken: c.or(E_ADDRESS, USDC, USDT, WETH, WXDAI),
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),
  allow.gnosis.cowswap.order_signer.unsignOrder(
    {
      sellToken: c.or(
        USDC, USDT, sDAI
      ),
      buyToken: c.or(E_ADDRESS, USDC, USDT, WETH, WXDAI),
      receiver: c.avatar,
    },
    {
      delegatecall: true
    }
  ),
  allow.gnosis.cowswap.order_signer.signOrder(
    {
      sellToken: WXDAI,
      buyToken: c.or(USDC, USDT, WETH),
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),
  allow.gnosis.cowswap.order_signer.unsignOrder(
    {
      sellToken: WXDAI,
      buyToken: c.or(USDC, USDT, WETH),
      receiver: c.avatar,
    },
    {
      delegatecall: true,
    }
  ),
  allow.gnosis.cowswap.order_signer.signOrder(
    {
      sellToken: wstETH,
      buyToken: WETH,
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),
  allow.gnosis.cowswap.order_signer.signOrder(
    {
      sellToken: CRV,
      buyToken: c.or(E_ADDRESS, USDC, WXDAI),
      receiver: c.avatar,
    },
    undefined,
    undefined,
    {
      delegatecall: true,
    }
  ),
  allow.gnosis.cowswap.order_signer.unsignOrder(
    {
      sellToken: wstETH,
      buyToken: WETH,
      receiver: c.avatar,
    },
    {
      delegatecall: true,
    }
  ),
] satisfies PermissionList