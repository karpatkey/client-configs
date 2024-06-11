import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  CRV,
  COMP,
  CVX,
  DAI,
  GHO,
  NOTE,
  USDC,
  USDT,
  SAFE,
  stETH,
  WBTC,
  WETH,
  wstETH,
  ZERO_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of AAVE and GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["GHO"] }),

  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Borrow GHO
  allowAction.aave_v3.borrow({ targets: ["GHO"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),
  // Aave v3 - Borrow WBTC
  allowAction.aave_v3.borrow({ targets: ["WBTC"] }),

  // Ankr
  allowAction.ankr.deposit(),

  // Aura - auraBAL Pool
  allowAction.aura.deposit({ targets: ["101"] }),
  // Aura - COW/GNO
  allowAction.aura.deposit({ targets: ["104"] }),
  // Aura - COW/WETH
  allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Balancer - Lock
  allowAction.balancer.lock(),

  // Convex - Lock
  allowAction.convex.lock(),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Stader
  allowAction.stader.deposit(),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // SAFE - Claim
  allow.mainnet.safe.ecosystem_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop_sep5.claimVestedTokens(undefined, c.avatar),
  // SAFE - Lock
  ...allowErc20Approve([SAFE], [contracts.mainnet.safe.token_lock]),
  allow.mainnet.safe.token_lock.lock(),
] satisfies PermissionList
