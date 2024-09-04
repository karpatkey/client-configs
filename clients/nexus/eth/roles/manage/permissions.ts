import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  ankrETH,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  ETHx,
  LDO,
  rETH,
  stETH,
  SWISE,
  USDC,
  USDT,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
  wstETH,
  curve,
  aave_v3,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/ 
  // Aave v3 - DAI
  allowAction.aave_v3.deposit({ targets: ["rETH"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - USDC
  allowAction.aave_v3.deposit({ targets: ["osETH"] }),
  // Aave v3 - ETH
  allowAction.aave_v3.deposit({ targets: ["ETH"] }),
  // Aave v3 - WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),

  // Aave v3 - Lido Market - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(WETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(WETH, undefined, c.avatar),

  // Aave v3 - Lido Market - wstETH
  ...allowErc20Approve([wstETH], [contracts.mainnet.aave_v3.pool_lido]),
  allow.mainnet.aave_v3.pool_lido.supply(wstETH, undefined, c.avatar),
  allow.mainnet.aave_v3.pool_lido.withdraw(wstETH, undefined, c.avatar),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - ETH
  allowAction.spark.deposit({ targets: ["ETH"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - ETH
  allowAction.spark.deposit({ targets: ["rETH"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["wstETH"] }),
] satisfies PermissionList
