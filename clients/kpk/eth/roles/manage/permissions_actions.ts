import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  USDC
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
  * Defi-Kit permissions
  *********************************************/
  // Aave v2 - Staking of AAVE in Safety Module
  allowAction.aave_v2.stake({ targets: ["AAVE"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),
  // Aura - Lock
  allowAction.aura.lock(),

  // Convex - USDT/WBTC/WETH
  allowAction.convex.deposit({ targets: ["38"] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  /*********************************************
  * Typed-presets permissions
  *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(
    undefined,
    c.avatar
  ),

] satisfies PermissionList